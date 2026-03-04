<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

class CommentPolicy
{
    // Only Students can comment, and ONLY on published articles
    public function comment(User $user, Article $article): bool
    {
        // Updated to safely match the style you used in ArticlePolicy
        return $user->hasRole('student') && $article->status->name === 'published';
    }
}
