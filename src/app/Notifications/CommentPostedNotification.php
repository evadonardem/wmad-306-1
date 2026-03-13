<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommentPostedNotification extends Notification
{
    use Queueable;

    public function __construct(public Comment $comment) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Comment on Your Article: ' . $this->comment->article->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A student has posted a new comment on your article.')
            ->line('**Article:** ' . $this->comment->article->title)
            ->line('**Comment by:** ' . $this->comment->student->name)
            ->line('**Comment:** ' . $this->comment->content)
            ->line('Keep up the great writing!');
    }
}
