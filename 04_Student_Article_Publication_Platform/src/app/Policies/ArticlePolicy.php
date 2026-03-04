<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

class ArticlePolicy
{
    // Only Writers can create articles
    public function create(User $user): bool
    {
        return $user->hasRole('writer');
    }

    // UPDATED: Added 'pending_review' to the allowed statuses for the owner
    // This allows the "Unsubmit" and "Revise" actions to pass authorization
    public function submit(User $user, Article $article): bool
    {
        return $user->hasRole('writer') &&
               $user->id === $article->writer_id &&
               in_array($article->status->name, ['draft', 'needs_revision', 'pending_review']);
    }

    // NEW: Explicit delete policy for drafts
    public function delete(User $user, Article $article): bool
    {
        return $user->id === $article->writer_id && $article->status->name === 'draft';
    }

    // Only Editors can request a revision, and only on submitted articles
    public function requestRevision(User $user, Article $article): bool
    {
        return $user->hasRole('editor') &&
               $article->status->name === 'pending_review';
    }

    // Only Editors can publish, and only submitted articles
    public function publish(User $user, Article $article): bool
    {
        return $user->hasRole('editor') &&
               $article->status->name === 'pending_review';
    }
}
