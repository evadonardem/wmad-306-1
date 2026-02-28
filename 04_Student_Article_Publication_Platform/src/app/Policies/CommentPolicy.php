<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\Comment;
use App\Models\User;

class CommentPolicy
{
    /**
     * Determine if the user can create comments
     */
    public function create(User $user, Article $article): bool
    {
        return $user->hasRole('student') && $article->isPublished();
    }

    /**
     * Determine if the user can delete their own comments
     */
    public function delete(User $user, Comment $comment): bool
    {
        return $user->id === $comment->student_id && $user->hasRole('student');
    }
}
