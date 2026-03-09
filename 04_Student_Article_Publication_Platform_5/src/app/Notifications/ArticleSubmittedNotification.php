<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ArticleSubmittedNotification extends Notification
{
    use Queueable;
    public $article;

    public function __construct($article)
    {
        $this->article = $article;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('New Article Submitted for Review')
                    ->greeting('Hello Editor,')
                    ->line('A new article titled "' . $this->article->title . '" has been submitted by ' . $this->article->writer->name . '.')
                    ->action('Review Article', url('/editor/dashboard'))
                    ->line('Please log in to your dashboard to review it.');
    }
}
