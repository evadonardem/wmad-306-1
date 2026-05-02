<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        return $this->successResponse(
            User::query()->select('id', 'name', 'email', 'created_at', 'updated_at')->withCount('leagues')->get(),
            'Users loaded'
        );
    }

    public function show(User $user)
    {
        return $this->successResponse(
            $user->load(['leagues.seasons']),
            'User loaded'
        );
    }
}