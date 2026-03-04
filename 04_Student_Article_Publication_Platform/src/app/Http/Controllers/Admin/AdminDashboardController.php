<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class AdminDashboardController extends Controller
{
    private const MANAGED_ROLES = ['admin', 'writer', 'editor'];
    private const ACCOUNT_STATUSES = ['active', 'suspended', 'pending', 'deleted'];

    /** Render the admin dashboard view. */
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', $this->buildAdminUserPayload());
    }

    /** Render the admin user-management view. */
    public function users(): Response
    {
        return Inertia::render('Admin/users', $this->buildAdminUserPayload());
    }

    private function buildAdminUserPayload(): array
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'account_status', 'suspended_at', 'created_at'])
            ->with('roles:name')
            ->whereHas('roles', function ($query): void {
                $query->whereIn('name', self::MANAGED_ROLES);
            })
            ->orderBy('name')
            ->get()
            ->map(function (User $user): array {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name')->values(),
                    'account_status' => $user->account_status,
                    'suspended_at' => $user->suspended_at,
                    'created_at' => $user->created_at,
                ];
            });

        return [
            'users' => $users,
            'roles' => Role::query()->whereIn('name', self::MANAGED_ROLES)->pluck('name')->values(),
        ];
    }

    /** Create a managed user account from admin input. */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['string', Rule::in(self::MANAGED_ROLES)],
            'account_status' => ['nullable', Rule::in(self::ACCOUNT_STATUSES)],
            'temporary_password' => ['nullable', 'string', 'min:8'],
        ]);

        $temporaryPassword = $validated['temporary_password'] ?? Str::password(12);

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($temporaryPassword),
            'email_verified_at' => now(),
            'account_status' => $validated['account_status'] ?? 'active',
            'suspended_at' => ($validated['account_status'] ?? 'active') === 'suspended' ? now() : null,
        ]);

        $user->syncRoles($validated['roles']);

        return back()->with('success', 'User account created successfully with temporary password: '.$temporaryPassword);
    }

    /** Update profile fields, roles, and status for a managed user. */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['string', Rule::in(self::MANAGED_ROLES)],
            'account_status' => ['required', Rule::in(self::ACCOUNT_STATUSES)],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'account_status' => $validated['account_status'],
            'suspended_at' => $validated['account_status'] === 'suspended' ? now() : null,
        ]);

        $user->syncRoles($validated['roles']);

        return back()->with('success', 'User account updated successfully.');
    }

    /** Change the account status of a managed user. */
    public function updateStatus(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'account_status' => ['required', Rule::in(self::ACCOUNT_STATUSES)],
        ]);

        if ($request->user()->id === $user->id && $validated['account_status'] === 'suspended') {
            return back()->with('error', 'Admin cannot suspend the current logged-in account.');
        }

        $user->update([
            'account_status' => $validated['account_status'],
            'suspended_at' => $validated['account_status'] === 'suspended' ? now() : null,
        ]);

        return back()->with('success', 'User status updated successfully.');
    }

    /** Replace the assigned roles for a managed user. */
    public function syncRoles(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['string', Rule::in(self::MANAGED_ROLES)],
        ]);

        $user->syncRoles($validated['roles']);

        return back()->with('success', 'User roles updated successfully.');
    }

    /** Soft-delete a managed user account and revoke roles. */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()->id === $user->id) {
            return back()->with('error', 'You cannot delete your own account while logged in.');
        }

        $isManagedUser = $user->roles()->whereIn('name', self::MANAGED_ROLES)->exists();

        if (!$isManagedUser) {
            return back()->with('error', 'This account is outside the admin user-management scope.');
        }

        $user->syncRoles([]);

        $user->update([
            'account_status' => 'deleted',
            'suspended_at' => now(),
        ]);

        return back()->with('success', 'User account deleted successfully.');
    }
}
