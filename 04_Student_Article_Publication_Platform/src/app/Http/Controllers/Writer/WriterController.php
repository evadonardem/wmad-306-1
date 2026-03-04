<?php

namespace App\Http\Controllers\Writer;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class WriterController extends Controller
{
    /** Store a new draft article from writer input. */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category_id' => ['nullable', 'exists:categories,id'],
        ]);

        $request->user()->articles()->create($validated);

        return back()->with('success', 'Draft saved successfully.');
    }

    /** Submit an existing article for editorial review. */
    public function submit(Article $article): RedirectResponse
    {
        $this->authorize('submit', $article);
        $article->update(['submitted_at' => now()]);

        return back()->with('success', 'Article submitted for review.');
    }

    /** Save a requested revision to the article content. */
    public function revise(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('requestRevision', $article);

        $validated = $request->validate([
            'content' => ['required', 'string'],
        ]);

        $article->update(['content' => $validated['content']]);

        return back()->with('success', 'Article revision saved.');
    }
}
