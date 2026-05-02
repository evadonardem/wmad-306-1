<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password'])
        ]);

        $token = $user->createToken('api-token')->plainTextToken;
        return $this->successResponse([
            'user' => $user,
            'token' => $token,
        ], 'Registered successfully', 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (! Auth::guard('web')->validate($credentials)) {
            return $this->errorResponse('Invalid credentials', 401);
        }

        $user = User::where('email', $credentials['email'])->first();
        $token = $user->createToken('api-token')->plainTextToken;

        return $this->successResponse([
            'user' => $user,
            'token' => $token,
        ], 'Logged in successfully');
    }

    public function logout(Request $request)
    {
        optional($request->user()->currentAccessToken())->delete();
        return $this->successResponse(null, 'Logged out');
    }

    public function user(Request $request)
    {
        return $this->successResponse(
            $request->user(),
            'Authenticated user loaded'
        );
    }
}
