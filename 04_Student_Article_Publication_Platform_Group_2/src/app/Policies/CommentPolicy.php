<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CommentPolicy
{
    use HandlesAuthorization;

    public function comment(User $user, Article $article)
    {
        // Students can comment on published articles.
        if ($user->hasRole('student')) {
            return $article->isPublished();
        }

        // Writers can comment on their own articles (drafts or published).
        if ($user->hasRole('writer')) {
            return $article->writer_id === $user->id;
        }

        // Editors can comment on any article.
        if ($user->hasRole('editor')) {
            return true;
        }

        return false;
    }

    public function moderate(User $user, Comment $comment)
    {
        return $user->hasRole('editor');
    }
}
