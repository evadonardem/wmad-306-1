<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Revision;
use App\Models\User;

class RevisionService
{
    /** Create a revision request for an article. */
    public function request(Article $article, User $editor, string $notes): Revision
    {
        return $article->revisions()->create([
            'requested_by' => $editor->id,
            'notes' => $notes,
        ]);
    }

    /** Mark a revision request as resolved. */
    public function resolve(Revision $revision): Revision
    {
        $revision->update(['resolved_at' => now()]);

        return $revision->refresh();
    }
}
