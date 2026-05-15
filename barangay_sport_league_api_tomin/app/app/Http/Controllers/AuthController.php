<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Traits\ApiResponder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ApiResponder;

    public function register(RegisterRequest $request): JsonResponse
    {
        $user  = User::create($request->validated());
        $token = $user->createToken('bsl-token')->plainTextToken;

        return $this->created([
            'user'  => $user,
            'token' => $token,
        ], 'Account created successfully.');
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'The provided credentials do not match our records.',
            ], 401);
        }

        // Revoke all previous tokens on each login (single-session approach)
        $user->tokens()->delete();
        $token = $user->createToken('bsl-token')->plainTextToken;

        return $this->ok([
            'user'  => $user,
            'token' => $token,
        ], 'Login successful.');
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->ok(null, 'You have been logged out.');
    }
}
