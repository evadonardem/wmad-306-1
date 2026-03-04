<?php

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EditorController extends Controller
{
    /** Record a completed editorial review action. */
    public function review(Article $article): RedirectResponse
    {
        $this->authorize('requestRevision', $article);

        return back()->with('success', 'Article review recorded.');
    }

    /** Request content updates from the writer for an article. */
    public function requestRevision(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('requestRevision', $article);

        $validated = $request->validate([
            'notes' => ['required', 'string'],
        ]);

        $article->revisions()->create([
            'requested_by' => $request->user()->id,
            'notes' => $validated['notes'],
        ]);

        return back()->with('success', 'Revision request sent to writer.');
    }

    /** Publish a submitted article for authenticated readers. */
    public function publish(Article $article): RedirectResponse
    {
        $this->authorize('publish', $article);
        $article->update(['published_at' => now()]);

        return back()->with('success', 'Article published successfully.');
    }

    /** Approve a published article for public homepage visibility. */
    public function approvePublic(Request $request, Article $article): RedirectResponse
    {
        // Separate gate: publishing and public homepage visibility are approved independently.
        $this->authorize('approvePublic', $article);

        // Store audit fields so we know who exposed the article publicly and when.
        $article->update([
            'is_public' => true,
            'public_approved_by' => $request->user()->id,
            'public_approved_at' => now(),
        ]);

        return back()->with('success', 'Article approved for public landing visibility.');
    }
}
