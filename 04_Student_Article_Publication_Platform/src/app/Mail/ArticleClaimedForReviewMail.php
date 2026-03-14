<?php

namespace App\Mail;

use App\Models\Article;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ArticleClaimedForReviewMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Article $article,
        public readonly User $editor,
    ) {
    }

    public function build(): self
    {
        return $this
            ->subject('Your Article Is Now Under Review')
            ->text('emails.article-claimed-for-review')
            ->with([
                'article' => $this->article,
                'editorName' => $this->editor->name,
                'authorName' => $this->article->author?->name ?? 'Writer',
            ]);
    }
}
