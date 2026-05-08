<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request): Response
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request): Response
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();

        return response(['message' => 'Logged out successfully']);
    }

    /**
     * Get current user
     */
    public function user(Request $request): Response
    {
        return response([
            'user' => $request->user(),
        ]);
    }
}
