<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function show()
    {
        return Inertia::render('Contact');
    }

    public function send(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $recipient = env('CONTACT_TO_ADDRESS', config('mail.from.address'));

        try {
            Mail::raw(
                "Contact message from {$validated['name']} ({$validated['email']})\n\n{$validated['message']}",
                function ($mail) use ($validated, $recipient) {
                    $mail->from($validated['email'], $validated['name'])
                        ->to($recipient)
                        ->subject($validated['subject']);
                }
            );

            return back()->with('success', 'Message sent successfully. Please check Mailtrap/Mailpit inbox.');
        } catch (TransportExceptionInterface $exception) {
            Log::warning('Contact email transport failed', [
                'message' => $exception->getMessage(),
            ]);

            return back()->with('error', 'Unable to connect to mail server. Please ensure Mailpit is running and try again.');
        }
    }
}
