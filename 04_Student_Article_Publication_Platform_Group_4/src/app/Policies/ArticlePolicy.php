<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

class ArticlePolicy
{
    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['student', 'writer']);
    }

    public function view(User $user, Article $article): bool
    {
        if ($user->hasRole('writer')) {
            return $article->status === 'approved' || $article->user_id === $user->id;
        }

        if ($user->hasRole('student')) {
            return $article->status === 'approved';
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('writer') && $user->is_approved && $user->can('article.create');
    }

    public function update(User $user, Article $article): bool
    {
        return $user->hasRole('writer')
            && $user->is_approved
            && $user->can('article.edit.own')
            && $article->user_id === $user->id;
    }

    public function delete(User $user, Article $article): bool
    {
        return $user->hasRole('writer')
            && $user->is_approved
            && $user->can('article.delete.own')
            && $article->user_id === $user->id;
    }
}
