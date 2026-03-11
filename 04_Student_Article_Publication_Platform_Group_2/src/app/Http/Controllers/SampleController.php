<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class SampleController extends Controller
{
    public function testEmail()
    {
        $text = fake()->paragraphs(3, true);
        Mail::raw($text, function (Message $message) {
            $appName = config('app.name');
            $subject = "$appName Test Email!";
            $message->to(fake()->safeEmail())->subject($subject);
        });

        return response()->json([
            'message' => 'Test Email Sent!',
        ]);
    }

    public function testJoditEditor()
    {
        return inertia('Sample/JoditEditorSample', []);
    }

    public function switch($role)
    {
        // switch to first user with the given role (demo only)
        $user = User::role($role)->first();
        if (! $user) {
            return response()->json(['message' => 'No demo user for role: ' . $role], 404);
        }

        Auth::login($user);
        return redirect('/');
    }

    public function logout()
    {
        Auth::logout();
        return redirect('/');
    }
}
