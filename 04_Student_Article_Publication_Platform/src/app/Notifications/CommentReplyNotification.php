<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CommentReplyNotification extends Notification
{
    use Queueable;

    public $replyingUser;
    public $articleTitle;

    public function __construct($replyingUser, $articleTitle)
    {
        $this->replyingUser = $replyingUser;
        $this->articleTitle = $articleTitle;
    }

    public function via(object $notifiable): array
    {
        // This tells Laravel to store the notification in the database for the UI bell icon
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => "{$this->replyingUser->name} replied to your comment on '{$this->articleTitle}'",
        ];
    }
}
