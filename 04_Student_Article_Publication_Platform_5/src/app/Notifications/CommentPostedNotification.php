<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommentPostedNotification extends Notification
{
    use Queueable;
    public $comment;

    public function __construct($comment)
    {
        $this->comment = $comment;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('New Comment on Your Article')
                    ->greeting('Hello ' . $this->comment->article->writer->name . ',')
                    ->line($this->comment->student->name . ' just commented on your article "' . $this->comment->article->title . '".')
                    ->line('Comment: "' . $this->comment->content . '"')
                    ->action('View Dashboard', url('/dashboard'))
                    ->line('Keep up the great writing!');
    }
}
