<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Revision;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class EditorController extends Controller
{
    use AuthorizesRequests;

    public function dashboard()
    {
        $articles = Article::with(['writer', 'status', 'category', 'revisions.editor'])
            ->whereHas('status', function ($query) {
                // Editors only see articles that are submitted or published
                $query->whereIn('name', ['pending_review', 'published']);
            })
            ->latest()
            ->get();

        return Inertia::render('Editor/Dashboard', ['articles' => $articles]);
    }

    public function requestRevision(Request $request, Article $article)
    {
        $this->authorize('requestRevision', $article);

        $validated = $request->validate(['comments' => 'required|string']);

        // 1. Create the revision record so the writer can see the feedback
        Revision::create([
            'article_id' => $article->id,
            'editor_id' => $request->user()->id,
            'comments' => $validated['comments'],
        ]);

        // 2. Update status and assign this editor to the article
        $needsRevisionStatus = ArticleStatus::where('name', 'needs_revision')->first();
        $article->update([
            'status_id' => $needsRevisionStatus->id,
            'editor_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Revision requested.');
    }

    public function publish(Request $request, Article $article)
    {
        $this->authorize('publish', $article);

        $publishedStatus = ArticleStatus::where('name', 'published')->first();

        $article->update([
            'status_id' => $publishedStatus->id,
            'editor_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Article published successfully!');
    }
}
