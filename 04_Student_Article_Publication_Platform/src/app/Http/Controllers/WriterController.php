<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Notification;
use App\Notifications\ArticleSubmittedNotification;

class WriterController extends Controller
{
    use AuthorizesRequests;

    public function dashboard(Request $request)
    {
        $articles = Article::with(['status', 'category'])
            ->where('writer_id', $request->user()->id)
            ->latest()
            ->get();

        // Also fetch categories so the writer can select one in the form
        $categories = \App\Models\Category::all();

        return Inertia::render('Writer/Dashboard', [
            'articles' => $articles,
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Article::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        $draftStatus = ArticleStatus::where('name', 'draft')->first();

        Article::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category_id' => $validated['category_id'],
            'status_id' => $draftStatus->id,
            'writer_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Draft saved successfully.');
    }

    public function submit(Article $article)
    {
        $this->authorize('submit', $article);

        $submittedStatus = ArticleStatus::where('name', 'pending_review')->first();
        $article->update(['status_id' => $submittedStatus->id]);

        // Phase 9: Notify all editors that a new article needs review
        $editors = User::role('editor')->get();
        Notification::send($editors, new ArticleSubmittedNotification($article));

        return back()->with('success', 'Article submitted for review.');
    }

    public function revise(Request $request, Article $article)
    {
        $this->authorize('submit', $article); // Use submit policy as it covers drafts & revisions

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        $article->update($validated);

        return back()->with('success', 'Article revised successfully.');
    }
}
