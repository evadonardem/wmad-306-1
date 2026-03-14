<?php

namespace App\Services;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\User;
use Illuminate\Support\Str;

class ArticleService
{
    private function generateUniqueSlug(string $title): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $suffix = 2;

        while (Article::query()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }

    /** Create a draft article for the given writer. */
    public function createDraft(User $writer, array $attributes): Article
    {
        $draftStatusId = ArticleStatus::query()->where('slug', 'draft')->value('id');

        return $writer->articles()->create([
            ...$attributes,
            'article_status_id' => $draftStatusId,
            'slug' => $this->generateUniqueSlug($attributes['title'] ?? 'draft'),
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
