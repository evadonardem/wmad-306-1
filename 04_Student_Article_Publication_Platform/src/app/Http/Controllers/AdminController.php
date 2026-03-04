<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        // Get all users and their current roles
        $users = User::with('roles')->get()->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->first()->name ?? 'student',
            ];
        });

        return Inertia::render('Admin/Dashboard', [
            'users' => $users
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
