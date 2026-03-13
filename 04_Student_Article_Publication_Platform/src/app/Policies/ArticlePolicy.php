<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

class ArticlePolicy
{
    /**
     * Determine if the user can create articles
     */
    public function create(User $user): bool
    {
        return $user->hasRole('writer');
    }

    /**
     * Determine if the user can edit their own articles
     */
    public function edit(User $user, Article $article): bool
    {
        return $user->id === $article->writer_id && $user->hasRole('writer');
    }

    /**
     * Determine if the user can submit articles
     */
    public function submit(User $user, Article $article): bool
    {
        return $user->id === $article->writer_id && $user->hasRole('writer');
    }

    /**
     * Determine if the user can review articles (editors only)
     */
    public function review(User $user, Article $article): bool
    {
        return $user->hasRole('editor');
    }

    /**
     * Determine if the user can request revisions (editors only)
     */
    public function requestRevision(User $user, Article $article): bool
    {
        return $user->hasRole('editor');
    }

    /**
     * Determine if the user can publish articles (editors only)
     */
    public function publish(User $user, Article $article): bool
    {
        return $user->hasRole('editor');
    }

    /**
     * Determine if the user can delete articles
     */
    public function delete(User $user, Article $article): bool
    {
        return $user->id === $article->writer_id && $user->hasRole('writer');
    }
}
