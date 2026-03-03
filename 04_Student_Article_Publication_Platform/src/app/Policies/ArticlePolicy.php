<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

class ArticlePolicy
{
    public function create(User $user): bool
    {
        return $user->hasRole('writer');
    }

    public function submit(User $user, Article $article): bool
    {
        return $user->hasRole('writer') && $article->user_id === $user->id;
    }

    public function requestRevision(User $user, Article $article): bool
    {
        return $user->hasRole('editor') || ($user->hasRole('writer') && $article->user_id === $user->id);
    }

    public function publish(User $user, Article $article): bool
    {
        return $user->hasRole('editor') && $article->submitted_at !== null;
    }

    public function approvePublic(User $user, Article $article): bool
    {
        return $user->hasRole('editor') && $article->published_at !== null;
    }

    public function comment(User $user, Article $article): bool
    {
        return $user->hasRole('student') && $article->published_at !== null;
    }
}
