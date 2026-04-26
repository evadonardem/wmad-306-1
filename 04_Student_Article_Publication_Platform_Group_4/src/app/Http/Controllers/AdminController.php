<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'pendingUsers' => User::with('roles')
                ->where(function ($query) {
                    $query->where('is_approved', false)
                        ->orWhereNotNull('writer_application_submitted_at');
                })
                ->latest()
                ->get(),
            'pendingArticles' => Article::with('user')->where('status', 'pending')->latest()->get(),
            'allUsers' => User::with('roles')->latest()->get(),
            'availableRoles' => Role::query()
                ->where('guard_name', 'web')
                ->whereNotIn('name', ['super admin', 'super-admin', 'super_admin'])
                ->orderBy('name')
                ->pluck('name'),
        ]);
    }

    public function approveUser(User $user): RedirectResponse
    {
        if ($user->hasRole('admin')) {
            return back()->with('error', 'Admin users do not require approval.');
        }

        $updates = ['is_approved' => true];

        // If a student requested writer access, grant writer role on approval.
        if ($user->hasRole('student') && $user->writer_application_submitted_at) {
            $user->syncRoles(['writer']);
            $updates['writer_application_reason'] = null;
            $updates['writer_application_submitted_at'] = null;
        }

        $user->update($updates);

        return back()->with('success', 'User approved successfully.');
    }

    public function updateArticleStatus(Request $request, Article $article): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $article->update([
            'status' => $validated['status'],
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Article status updated.');
    }

    public function updateUserRole(Request $request, User $user): RedirectResponse
    {
        if ($request->user()->id === $user->id) {
            return back()->with('error', 'You cannot change your own role.');
        }

        $validated = $request->validate([
            'role' => [
                'required',
                'string',
                'exists:roles,name,guard_name,web',
                'not_in:super admin,super-admin,super_admin',
            ],
        ]);

        $newRole = $validated['role'];
        $currentRole = $user->roles->pluck('name')->first();

        if ($newRole === $currentRole) {
            return back()->with('success', 'User role is already up to date.');
        }

        if ($currentRole === 'admin' && $newRole !== 'admin') {
            $adminCount = User::role('admin')->count();
            if ($adminCount <= 1) {
                return back()->with('error', 'Cannot revoke the last remaining admin account.');
            }
        }

        $user->syncRoles([$newRole]);

        if ($newRole === 'admin' && ! $user->is_approved) {
            $user->update(['is_approved' => true]);
        }

        return back()->with('success', 'User role updated successfully.');
    }

    public function destroyUser(Request $request, User $user): RedirectResponse
    {
        if ($request->user()->id === $user->id) {
            return back()->with('error', 'You cannot delete your own admin account.');
        }

        if ($user->hasRole('admin')) {
            return back()->with('error', 'Deleting admin accounts is not allowed.');
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }
}
