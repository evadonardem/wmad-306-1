<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // 🔥 REGISTER
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Success',
            'data' => [
                'user' => $user,
                'token' => $token,
            ]
        ], 201);
    }

    // 🔥 LOGIN (FIXED)
    public function login(LoginRequest $request)
    {
        // 🔥 Find user manually (API-safe)
        $user = User::where('email', $request->email)->first();

        // ❌ Invalid email or password
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        // 🔥 Create token
        $token = $user->createToken('auth_token', ['delete'])->plainTextToken;

        return response()->json([
            'message' => 'Success',
            'data' => [
                'user' => $user,
                'token' => $token,
            ]
        ]);
    }
}