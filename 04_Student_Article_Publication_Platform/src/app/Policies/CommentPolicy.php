<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

class CommentPolicy
{
    // Only Students can comment, and ONLY on published articles
    public function comment(User $user, Article $article): bool
    {
        return $user->hasRole('student') && $article->isPublished();
    }
}
