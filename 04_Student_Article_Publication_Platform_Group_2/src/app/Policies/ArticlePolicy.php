<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ArticlePolicy
{
    use HandlesAuthorization;

    public function create(User $user)
    {
        return $user->hasRole('writer');
    }

    public function submit(User $user, Article $article)
    {
        return $user->id === $article->writer_id && $user->hasRole('writer');
    }

    public function requestRevision(User $user, Article $article)
    {
        return $user->hasRole('editor');
    }

    public function publish(User $user, Article $article)
    {
        return $user->hasRole('editor');
    }

    public function revise(User $user, Article $article)
    {
        return $user->hasRole('writer') && $article->writer_id === $user->id;
    }

    public function delete(User $user, Article $article)
    {
        // Writers can delete their own articles; editors can delete any
        if ($user->hasRole('editor')) {
            return true;
        }
        if ($user->hasRole('writer')) {
            return $article->writer_id === $user->id;
        }
        return false;
    }

    public function view(User $user, Article $article)
    {
        // writers can view own; editors can view any; students can view published
        if ($user->hasRole('editor')) {
            return true;
        }
        if ($user->hasRole('writer')) {
            return $article->writer_id === $user->id;
        }
        if ($user->hasRole('student')) {
            return $article->isPublished();
        }
        return false;
    }
}
