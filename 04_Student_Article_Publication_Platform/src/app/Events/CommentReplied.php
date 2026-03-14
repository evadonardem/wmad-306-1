<?php

namespace App\Events;

use App\Models\Comment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CommentReplied implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $comment;
    public $reply;

    public function __construct(Comment $comment, Comment $reply)
    {
        $this->comment = $comment;
        $this->reply = $reply;
    }

    public function broadcastOn()
    {
        // Only the original comment's user should get this notification
        return new PrivateChannel('user.' . $this->comment->user_id);
    }

    public function broadcastWith()
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
        ];
    }
}
