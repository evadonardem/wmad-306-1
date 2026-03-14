<?php

namespace App\Mail;

use App\Models\Article;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EditorialOutcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Article $article,
        public readonly string $outcome,
        public readonly ?string $note = null,
    ) {
    }

    public function build(): self
    {
        $subject = match ($this->outcome) {
            'rejected' => 'Article Review Result: Rejected',
            'revision_requested' => 'Article Review Result: Revision Requested',
            default => 'Article Review Result: Published',
        };

        return $this
            ->subject($subject)
            ->text('emails.editorial-outcome')
            ->with([
                'article' => $this->article,
                'outcome' => $this->outcome,
                'note' => $this->note,
                'authorName' => $this->article->author?->name ?? 'Writer',
            ]);
    }
}
