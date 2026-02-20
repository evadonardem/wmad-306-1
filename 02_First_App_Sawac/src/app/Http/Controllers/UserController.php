<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class UserController extends Controller
{
    public function list()
    {
        $users = User::select('id', 'first_name', 'last_name', 'email')
            ->get()
            ->map(fn($u) => [
                'id' => $u->id,
                'name' => trim(($u->first_name ?? '') . ' ' . ($u->last_name ?? '')),
                'email' => $u->email,
            ]);

        return Inertia::render('Users/List', [
            'users' => $users,
        ]);
    }
}
