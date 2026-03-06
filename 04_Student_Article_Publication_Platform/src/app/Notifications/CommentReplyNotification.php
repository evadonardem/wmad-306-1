<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CommentReplyNotification extends Notification
{
    use Queueable;

    public $replyingUser;
    public $articleTitle;
    public $articleId; // NEW: Added this variable

    public function __construct($replyingUser, $articleTitle, $articleId) // UPDATED constructor
    {
        $this->replyingUser = $replyingUser;
        $this->articleTitle = $articleTitle;
        $this->articleId = $articleId; // NEW: Storing the ID
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'article_id' => $this->articleId, // NEW: Sending ID to the Bell
            'title' => 'New Reply!',
            'message' => "{$this->replyingUser->name} replied to your comment on '{$this->articleTitle}'",
        ];
    }
}
