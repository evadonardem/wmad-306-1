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
    /** Notify editors that a writer has submitted an article. */
    public function notifyEditorsArticleSubmitted(iterable $editors, Article $article): void
    {
        foreach ($editors as $editor) {
            $editor->notify(new ArticleSubmittedNotification($article));
        }
    }

    /** Notify a writer that revisions were requested. */
    public function notifyWriterRevisionRequested(User $writer, Article $article): void
    {
        $writer->notify(new RevisionRequestedNotification($article));
    }

    /** Notify students that a new article is published. */
    public function notifyStudentsArticlePublished(iterable $students, Article $article): void
    {
        foreach ($students as $student) {
            $student->notify(new ArticlePublishedNotification($article));
        }
    }

    /** Notify the article author about a newly posted comment. */
    public function notifyAuthorCommentPosted(User $author, Comment $comment): void
    {
        $author->notify(new CommentPostedNotification($comment));
    }
}
