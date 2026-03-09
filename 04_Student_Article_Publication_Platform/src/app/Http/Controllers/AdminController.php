<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        // Fetch all users with their roles eagerly loaded
        $users = User::with('roles')->get();

        // Calculate Metrics for the new KPI Ribbon
        $metrics = [
            'total' => $users->count(),
            'admins' => $users->filter(fn($user) => $user->roles->contains('name', 'admin'))->count(),
            'editors' => $users->filter(fn($user) => $user->roles->contains('name', 'editor'))->count(),
            'writers' => $users->filter(fn($user) => $user->roles->contains('name', 'writer'))->count(),
            'students' => $users->filter(fn($user) => $user->roles->contains('name', 'student'))->count(),
        ];

        $mappedUsers = $users->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->first()->name ?? 'student',
            ];
        });

        return Inertia::render('Admin/Dashboard', [
            'users' => $mappedUsers,
            'metrics' => $metrics // Passing the counts to React
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:student,writer,editor,admin'
        ]);

        // This removes old roles and applies the new one instantly
        $user->syncRoles([$request->role]);

        return back()->with('success', 'User role updated successfully.');
    }
}
