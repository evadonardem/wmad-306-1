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
    private const MANAGED_ROLES = ['writer', 'editor'];

    public function index(): Response
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'account_status', 'suspended_at'])
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
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'users' => $users,
            'roles' => Role::query()->whereIn('name', self::MANAGED_ROLES)->pluck('name')->values(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', 'string', Rule::in(self::MANAGED_ROLES)],
            'account_status' => ['nullable', 'in:active,suspended'],
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

        $user->syncRoles([$validated['role']]);

        return back()->with('success', 'User account created successfully with temporary password: '.$temporaryPassword);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        if (!$this->isManageableUser($user)) {
            return back()->with('error', 'Only writer and editor accounts can be managed here.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'role' => ['required', 'string', Rule::in(self::MANAGED_ROLES)],
            'account_status' => ['required', 'in:active,suspended'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'account_status' => $validated['account_status'],
            'suspended_at' => $validated['account_status'] === 'suspended' ? now() : null,
        ]);

        $user->syncRoles([$validated['role']]);

        return back()->with('success', 'User account updated successfully.');
    }

    public function updateStatus(Request $request, User $user): RedirectResponse
    {
        if (!$this->isManageableUser($user)) {
            return back()->with('error', 'Only writer and editor accounts can be managed here.');
        }

        $validated = $request->validate([
            'account_status' => ['required', 'in:active,suspended'],
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

    public function syncRoles(Request $request, User $user): RedirectResponse
    {
        if (!$this->isManageableUser($user)) {
            return back()->with('error', 'Only writer and editor accounts can be managed here.');
        }

        $validated = $request->validate([
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['string', Rule::in(self::MANAGED_ROLES)],
        ]);

        $user->syncRoles($validated['roles']);

        return back()->with('success', 'User roles updated successfully.');
    }

    private function isManageableUser(User $user): bool
    {
        return $user->roles()->whereIn('name', self::MANAGED_ROLES)->exists();
    }
}
