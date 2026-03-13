<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Mail;
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

    public function assigningRoles()
    {
        // Get or create test user with writer role
        $user = User::firstOrCreate(
            ['email' => 'writer@test.com'],
            ['name' => 'Test Writer', 'password' => bcrypt('password')]
        );

        // Assign writer role if not already assigned
        if (!$user->hasRole('writer')) {
            $user->assignRole('writer');
        }

        return response()->json([
            'message' => 'Test user assigned writer role',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
            ],
        ]);
    }
}
