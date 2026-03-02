<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Comment;
use App\Models\User;
use App\Notifications\ArticlePublishedNotification;
use App\Notifications\ArticleSubmittedNotification;
use App\Notifications\CommentPostedNotification;
use App\Notifications\RevisionRequestedNotification;

class NotificationService
{
    public function notifyEditorsArticleSubmitted(iterable $editors, Article $article): void
    {
        foreach ($editors as $editor) {
            $editor->notify(new ArticleSubmittedNotification($article));
        }
    }

    public function notifyWriterRevisionRequested(User $writer, Article $article): void
    {
        $writer->notify(new RevisionRequestedNotification($article));
    }

    public function notifyStudentsArticlePublished(iterable $students, Article $article): void
    {
        foreach ($students as $student) {
            $student->notify(new ArticlePublishedNotification($article));
        }
    }

    public function notifyAuthorCommentPosted(User $author, Comment $comment): void
    {
        $author->notify(new CommentPostedNotification($comment));
    }
}
