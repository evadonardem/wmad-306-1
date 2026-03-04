<?php

namespace App\Services;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\User;

class ArticleService
{
    /** Create a draft article for the given writer. */
    public function createDraft(User $writer, array $attributes): Article
    {
        $draftStatusId = ArticleStatus::query()->where('slug', 'draft')->value('id');

        return $writer->articles()->create([
            ...$attributes,
            'article_status_id' => $draftStatusId,
        ]);
    }

    /** Transition an article to submitted status with timestamp. */
    public function submit(Article $article): Article
    {
        $submittedStatusId = ArticleStatus::query()->where('slug', 'submitted')->value('id');
        $article->update([
            'article_status_id' => $submittedStatusId,
            'submitted_at' => now(),
        ]);

        return $article->refresh();
    }
}
