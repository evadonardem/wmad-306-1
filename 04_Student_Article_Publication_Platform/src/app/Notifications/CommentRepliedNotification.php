<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Comment;

class CommentRepliedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $comment;
    public $reply;

    public function __construct(Comment $comment, Comment $reply)
    {
        $this->comment = $comment;
        $this->reply = $reply;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'reply',
            'comment_id' => $this->comment->id,
            'reply' => [
                'id' => $this->reply->id,
                'body' => $this->reply->body,
                'author' => $this->reply->user?->name,
                'created_at' => $this->reply->created_at,
            ],
            'article_id' => $this->comment->article_id,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line('Someone replied to your comment!')
            ->action('View Reply', url('/articles/' . $this->comment->article_id))
            ->line('Thank you for engaging!');
    }
}
