<?php

namespace App\Notifications;

use App\Models\Article;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ArticleSubmittedNotification extends Notification
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
            ->subject('New Article Submitted for Review: ' . $this->article->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A new article has been submitted and is waiting for your review.')
            ->line('**Title:** ' . $this->article->title)
            ->line('**Author:** ' . $this->article->writer->name)
            ->line('**Category:** ' . $this->article->category->name)
            ->action('Review Article', url(route('editor.review', $this->article)))
            ->line('Please log in to the platform to review and take action on this article.');
    }
}
