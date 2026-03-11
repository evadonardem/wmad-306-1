<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommentPostedNotification extends Notification
{
    use Queueable;

    protected $comment;

    public function __construct(Comment $comment)
    {
        $this->comment = $comment;
    }

    public function via($notifiable)
    {
        return ['mail','database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Comment On Your Article')
            ->line('A student commented on your article.')
            ->line('Article: '.$this->comment->article->title)
            ->action('View Article', route('articles.show', $this->comment->article->id));
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'comment_posted',
            'message' => 'New comment on: '.$this->comment->article->title,
            'url' => route('articles.show', $this->comment->article->id)
        ];
    }
}
