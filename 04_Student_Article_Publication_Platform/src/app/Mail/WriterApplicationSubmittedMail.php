<?php

namespace App\Mail;

use App\Models\WriterApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WriterApplicationSubmittedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly WriterApplication $application)
    {
    }

    public function build(): self
    {
        $applicant = $this->application->applicant;

        return $this
            ->subject('New Writer Application Received')
            ->text('emails.writer-application-submitted')
            ->with([
                'application' => $this->application,
                'applicantName' => $applicant?->name ?? 'Unknown Applicant',
                'applicantEmail' => $applicant?->email ?? '-',
            ]);
    }
}
