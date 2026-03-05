<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

class ArticlePolicy
{
    /** Determine whether the user can create an article. */
    public function create(User $user): bool
    {
        return $user->hasRole('writer');
    }

    /** Determine whether the user can submit the article. */
    public function submit(User $user, Article $article): bool
    {
        return $user->hasRole('writer') && $article->user_id === $user->id;
    }

    /** Determine whether the user can request a revision. */
    public function requestRevision(User $user, Article $article): bool
    {
        return $user->hasRole('editor') || ($user->hasRole('writer') && $article->user_id === $user->id);
    }

    /** Determine whether the user can publish the article. */
    public function publish(User $user, Article $article): bool
    {
        return $user->hasRole('editor') && $article->submitted_at !== null;
    }

    /** Determine whether the user can approve public visibility. */
    public function approvePublic(User $user, Article $article): bool
    {
        // Only editors can expose already-published articles to public pages.
        return $user->hasRole('editor') && $article->published_at !== null;
    }

    /** Determine whether the user can comment on the article. */
    public function comment(User $user, Article $article): bool
    {
        return $user->hasRole('student') && $article->published_at !== null;
    }

    /** Determine whether the user can star the article. */
    public function star(User $user, Article $article): bool
    {
        return $user->hasRole('student') && $article->published_at !== null;
    }

    /** Determine whether the user can record a view on the article. */
    public function view(User $user, Article $article): bool
    {
        return $user->hasRole('student') && $article->published_at !== null;
    }

    /** Determine whether the user can save/unsave the article. */
    public function save(User $user, Article $article): bool
    {
        return $user->hasRole('student') && $article->published_at !== null;
    }
}
