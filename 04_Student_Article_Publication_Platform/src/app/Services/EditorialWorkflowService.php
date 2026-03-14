<?php

namespace App\Services;

use App\Models\Article;
use App\Models\ArticleStatus;
use Illuminate\Validation\ValidationException;

class EditorialWorkflowService
{
    /** Resolve canonical article status id by slug when available. */
    private function statusId(string $slug): ?int
    {
        return ArticleStatus::query()->where('slug', $slug)->value('id');
    }

    /** Validate that an editor is not performing editorial decisions on own content. */
    public function assertNotOwnArticle(Article $article, int $actorId, string $actionLabel): void
    {
        if ((int) $article->user_id === $actorId) {
            throw ValidationException::withMessages([
                'article' => "You cannot {$actionLabel} your own article.",
            ]);
        }
    }

    /** Validate an article can be claimed from queue. */
    public function assertClaimable(Article $article): void
    {
        if ($article->published_at !== null || $article->claimed_by_editor_id !== null) {
            throw ValidationException::withMessages([
                'article' => 'This article is already claimed or no longer reviewable.',
            ]);
        }

        $submittedStatusId = $this->statusId('submitted');
        if ($submittedStatusId && (int) $article->article_status_id !== (int) $submittedStatusId) {
            throw ValidationException::withMessages([
                'article' => 'Only submitted entries can be claimed for review.',
            ]);
        }
    }

    /** Ensure the current editor has an active claim before final editorial actions. */
    public function assertClaimedByEditor(Article $article, int $editorId): void
    {
        if ((int) $article->claimed_by_editor_id !== $editorId) {
            throw ValidationException::withMessages([
                'article' => 'Claim this article before taking this action.',
            ]);
        }
    }

    /** Claim an article for editor review. */
    public function claim(Article $article, int $editorId): Article
    {
        $this->assertClaimable($article);

        $article->update([
            'claimed_by_editor_id' => $editorId,
            'claimed_at' => now(),
            'rejected_by_editor_id' => null,
            'rejected_at' => null,
        ]);

        return $article->refresh();
    }

    /** Release an editor claim and return article to queue. */
    public function release(Article $article): Article
    {
        $article->update([
            'claimed_by_editor_id' => null,
            'claimed_at' => null,
        ]);

        return $article->refresh();
    }

    /** Return an article for writer revision. */
    public function returnForRevision(Article $article, string $notes): Article
    {
        $revisionStatusId = $this->statusId('revision-requested');

        $article->update([
            'article_status_id' => $revisionStatusId ?: $article->article_status_id,
            'editorial_decision_notes' => $notes,
            'claimed_by_editor_id' => null,
            'claimed_at' => null,
        ]);

        return $article->refresh();
    }

    /** Reject an article from editorial queue. */
    public function reject(Article $article, int $editorId, string $reason): Article
    {
        $rejectedStatusId = $this->statusId('rejected');

        $article->update([
            'article_status_id' => $rejectedStatusId ?: $article->article_status_id,
            'editorial_decision_notes' => $reason,
            'rejected_by_editor_id' => $editorId,
            'rejected_at' => now(),
            'claimed_by_editor_id' => null,
            'claimed_at' => null,
        ]);

        return $article->refresh();
    }

    /** Publish an accepted article into authenticated scope. */
    public function publish(Article $article): Article
    {
        $publishedStatusId = $this->statusId('published');

        $article->update([
            'article_status_id' => $publishedStatusId ?: $article->article_status_id,
            'published_at' => now(),
            'is_public' => false,
            'public_approved_by' => null,
            'public_approved_at' => null,
            'claimed_by_editor_id' => null,
            'claimed_at' => null,
            'rejected_by_editor_id' => null,
            'rejected_at' => null,
        ]);

        return $article->refresh();
    }

    /** Approve a published article for public listing. */
    public function approvePublic(Article $article, int $editorId): Article
    {
        $article->update([
            'is_public' => true,
            'public_approved_by' => $editorId,
            'public_approved_at' => now(),
        ]);

        return $article->refresh();
    }
}
