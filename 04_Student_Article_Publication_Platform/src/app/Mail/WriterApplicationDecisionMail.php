<?php

namespace App\Mail;

use App\Models\WriterApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WriterApplicationDecisionMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly WriterApplication $application,
        public readonly bool $accepted,
    ) {
    }

    public function build(): self
    {
        return $this
            ->subject($this->accepted ? 'Writer Application Approved' : 'Writer Application Update')
            ->text('emails.writer-application-decision')
            ->with([
                'application' => $this->application,
                'accepted' => $this->accepted,
                'applicantName' => $this->application->applicant?->name ?? 'Applicant',
            ]);
    }
}
