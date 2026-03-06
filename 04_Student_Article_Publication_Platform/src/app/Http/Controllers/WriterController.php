<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Notification;
use App\Notifications\ArticleSubmittedNotification;

class WriterController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display the writer's dashboard with articles and comments.
     */
    public function dashboard(Request $request)
    {
        // UPDATED: Eager loading comments and nested replies
        $articles = Article::with([
            'status',
            'category',
            'comments' => function ($query) {
                // We only want the top-level comments; the model handles the tree
                $query->whereNull('parent_id')
                      ->with(['user', 'replies.user']) // Loads comment authors and reply authors
                      ->latest();
            }
        ])
        ->where('writer_id', $request->user()->id)
        ->latest()
        ->get();

        $categories = Category::all();

        return Inertia::render('Writer/Dashboard', [
            'articles' => $articles,
            'categories' => $categories
        ]);
    }

    /**
     * Store a new draft in the database.
     */
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

    /**
     * Update an existing draft or an article needing revision.
     */
    public function revise(Request $request, Article $article)
    {
        $this->authorize('submit', $article);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        $article->update($validated);

        return back()->with('success', 'Article updated successfully.');
    }

    /**
     * Push a draft to the Editor's queue.
     */
    public function submit(Article $article)
    {
        $this->authorize('submit', $article);

        $submittedStatus = ArticleStatus::where('name', 'pending_review')->first();
        $article->update(['status_id' => $submittedStatus->id]);

        // Notify editors
        $editors = User::role('editor')->get();
        Notification::send($editors, new ArticleSubmittedNotification($article));

        return back()->with('success', 'Article submitted for review.');
    }

    /**
     * Pull a pending article back to draft status (Unsubmit).
     */
    public function unsubmit(Article $article)
    {
        $this->authorize('submit', $article);

        if ($article->status->name === 'pending_review') {
            $draftStatus = ArticleStatus::where('name', 'draft')->first();
            $article->update(['status_id' => $draftStatus->id]);
            return back()->with('success', 'Article pulled back to drafts.');
        }

        return abort(403, 'Only pending articles can be unsubmitted.');
    }

    /**
     * Permanently delete a draft.
     */
    public function destroy(Article $article)
    {
        $this->authorize('delete', $article);

        if ($article->status->name === 'draft') {
            $article->delete();
            return back()->with('success', 'Draft deleted successfully.');
        }

        return abort(403, 'Only drafts can be deleted.');
    }
}
