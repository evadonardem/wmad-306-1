<?php

namespace App\Services;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\User;

class ArticleService
{
    public function createDraft(User $writer, array $attributes): Article
    {
        $draftStatusId = ArticleStatus::query()->where('slug', 'draft')->value('id');

        return $writer->articles()->create([
            ...$attributes,
            'article_status_id' => $draftStatusId,
        ]);
    }

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
