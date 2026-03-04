<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Mail;

class SampleController extends Controller
{
    /** Send a sample email for mail configuration checks. */
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

    /** Render the sample Jodit editor page. */
    public function testJoditEditor()
    {
        return inertia('Sample/JoditEditorSample', []);
    }
}
