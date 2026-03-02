<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ArticlePublishedNotification extends Notification
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
                    ->subject('Congratulations! Your Article is Published')
                    ->greeting('Hello ' . $this->article->writer->name . ',')
                    ->line('Great news! Your article "' . $this->article->title . '" has been approved and published.')
                    ->action('View Dashboard', url('/dashboard'))
                    ->line('Thank you for contributing to the platform!');
    }
}
