<?php

namespace App\Notifications;

use App\Models\Article;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RevisionRequestedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Article $article,
        public string $feedback
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Revision Requested for Your Article: ' . $this->article->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('An editor has requested revisions on your article.')
            ->line('**Title:** ' . $this->article->title)
            ->line('**Editor Feedback:** ' . $this->feedback)
            ->action('Edit Article', url(route('articles.edit', $this->article)))
            ->line('Please update your article based on the feedback and re-submit for review.');
    }
}
