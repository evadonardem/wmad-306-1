<?php

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EditorController extends Controller
{
    public function review(Article $article): RedirectResponse
    {
        $this->authorize('requestRevision', $article);

        return back()->with('success', 'Article review recorded.');
    }

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

    public function publish(Article $article): RedirectResponse
    {
        $this->authorize('publish', $article);
        $article->update(['published_at' => now()]);

        return back()->with('success', 'Article published successfully.');
    }
}
