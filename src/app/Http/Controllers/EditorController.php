<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Revision;
use App\Notifications\ArticlePublishedNotification;
use App\Notifications\RevisionRequestedNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EditorController extends Controller
{
    /**
     * Show editor dashboard with articles to review
     */
    public function dashboard(): Response
    {
        $submittedStatus = ArticleStatus::where('name', 'Submitted')->first();

        $articlesForReview = Article::where('status_id', $submittedStatus->id)
            ->with(['writer', 'category', 'status'])
            ->latest()
            ->paginate(10);

        $needsRevisionArticles = Article::whereHas('status', function ($query) {
            $query->where('name', 'Needs Revision');
        })
            ->with(['writer', 'category', 'status'])
            ->latest()
            ->paginate(10);

        $publishedArticles = Article::whereHas('status', function ($query) {
            $query->where('name', 'Published');
        })
            ->with(['writer', 'category', 'status'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Editor/Dashboard', [
            'articlesForReview' => $articlesForReview,
            'needsRevisionArticles' => $needsRevisionArticles,
            'publishedArticles' => $publishedArticles,
        ]);
    }

    /**
     * Show article review page
     */
    public function review(Article $article): Response
    {
        $this->authorize('review', $article);

        return Inertia::render('Editor/ReviewArticle', [
            'article' => $article->load(['writer', 'category', 'status', 'revisions']),
        ]);
    }

    /**
     * Request revision on article
     */
    public function requestRevision(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('requestRevision', $article);

        $validated = $request->validate([
            'feedback' => 'required|string',
        ]);

        $needsRevisionStatus = ArticleStatus::where('name', 'Needs Revision')->first();

        Revision::create([
            'article_id' => $article->id,
            'editor_id' => Auth::id(),
            'feedback' => $validated['feedback'],
        ]);

        $article->update([
            'status_id' => $needsRevisionStatus->id,
        ]);

        $article->writer->notify(new RevisionRequestedNotification($article->load('category'), $validated['feedback']));

        return redirect()->route('editor.dashboard')->with('success', 'Revision requested successfully.');
    }

    /**
     * Publish article
     */
    public function publish(Article $article): RedirectResponse
    {
        $this->authorize('publish', $article);

        $publishedStatus = ArticleStatus::where('name', 'Published')->first();

        $article->update([
            'editor_id' => Auth::id(),
            'status_id' => $publishedStatus->id,
        ]);

        $article->writer->notify(new ArticlePublishedNotification($article->load('category')));

        return redirect()->route('editor.dashboard')->with('success', 'Article published successfully.');
    }

    /**
     * Update article content (editor inline edit)
     */
    public function updateContent(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('editContent', $article);

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $article->update([
            'content' => $validated['content'],
        ]);

        return redirect()->back()->with('success', 'Article content updated successfully.');
    }
}
