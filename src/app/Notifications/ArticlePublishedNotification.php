<?php

namespace App\Notifications;

use App\Models\Article;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ArticlePublishedNotification extends Notification
{
    use Queueable;

    public function __construct(public Article $article) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your Article Has Been Published: ' . $this->article->title)
            ->greeting('Congratulations, ' . $notifiable->name . '!')
            ->line('Your article has been reviewed and published on the platform.')
            ->line('**Title:** ' . $this->article->title)
            ->line('**Category:** ' . $this->article->category->name)
            ->line('Your article is now visible to all students on the platform.')
            ->line('Thank you for your contribution!');
    }
}
