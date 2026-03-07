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

    /** Determine whether the user can view the article for editing. */
    public function view(User $user, Article $article): bool
    {
        // Editor access must take precedence for dual-role users (editor+writer).
        if ($user->hasRole('editor')) {
            return true;
        }

        if ($user->hasRole('writer')) {
            return $article->user_id === $user->id;
        }

        // Students can view/record views only for published articles.
        if ($user->hasRole('student')) {
            return $article->published_at !== null;
        }

        return false;
    }

    /** Determine whether the user can update the article draft content. */
    public function update(User $user, Article $article): bool
    {
        return $user->hasRole('writer') && $article->user_id === $user->id;
    }

    /** Determine whether the user can submit the article. */
    public function submit(User $user, Article $article): bool
    {
        return $user->hasRole('writer') && $article->user_id === $user->id;
    }

    /** Determine whether the user can request a revision. */
    public function requestRevision(User $user, Article $article): bool
    {
        if ($user->hasRole('editor')) {
            return $article->user_id !== $user->id && $article->submitted_at !== null;
        }

        return $user->hasRole('writer') && $article->user_id === $user->id;
    }

    /** Determine whether the user can publish the article. */
    public function publish(User $user, Article $article): bool
    {
        return $user->hasRole('editor')
            && $article->user_id !== $user->id
            && $article->submitted_at !== null;
    }

    /** Determine whether the user can approve public visibility. */
    public function approvePublic(User $user, Article $article): bool
    {
        // Only editors can expose already-published articles to public pages.
        return $user->hasRole('editor')
            && $article->user_id !== $user->id
            && $article->published_at !== null;
    }

    /** Determine whether the user can comment on the article. */
    public function comment(User $user, Article $article): bool
    {
        // Any authenticated account can comment, as long as the article is published.
        return $article->published_at !== null;
    }

    /** Determine whether the user can star the article. */
    public function star(User $user, Article $article): bool
    {
        return $user->hasRole('student') && $article->published_at !== null;
    }

    /** Determine whether the user can save/unsave the article. */
    public function save(User $user, Article $article): bool
    {
        return $user->hasRole('student') && $article->published_at !== null;
    }
}
