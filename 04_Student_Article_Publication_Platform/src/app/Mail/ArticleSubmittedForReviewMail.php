<?php

namespace App\Mail;

use App\Models\Article;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ArticleSubmittedForReviewMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Article $article,
        public readonly bool $isResubmission = false,
    ) {
    }

    public function build(): self
    {
        return $this
            ->subject($this->isResubmission ? 'Article Resubmitted for Review' : 'New Article Submitted for Review')
            ->text('emails.article-submitted-for-review')
            ->with([
                'article' => $this->article,
                'isResubmission' => $this->isResubmission,
                'authorName' => $this->article->author?->name ?? 'Writer',
            ]);
    }
}
