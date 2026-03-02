<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\View\View;

class UserController extends Controller
{
    public function list(): View
    {
        return view('users.list', [
            'users' => User::all(),
        ]);
    }
}
