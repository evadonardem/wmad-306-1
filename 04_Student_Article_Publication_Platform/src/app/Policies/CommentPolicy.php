<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;

class CommentPolicy
{
    public function comment(User $user, Comment $comment): bool
    {
        return $user->id === $comment->user_id || $user->hasRole('editor');
    }
}
