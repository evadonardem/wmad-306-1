<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ThemeController extends Controller
{
    public function toggle(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'theme' => 'required|in:light,dark'
        ]);

        $user->update([
            'theme_preference' => $data['theme']
        ]);

        return back();
    }
}
