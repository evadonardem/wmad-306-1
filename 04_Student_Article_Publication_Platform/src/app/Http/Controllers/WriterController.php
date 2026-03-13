<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WriterController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:writer']);
    }

    /**
     * Show writer dashboard
     */
    public function dashboard(): Response
    {
        /** @var User $user */
        $user = Auth::user();
        $articles = $user->writtenArticles()
            ->with(['status', 'category'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Writer/Dashboard', [
            'articles' => $articles,
        ]);
    }

    /**
     * Show create article form
     */
    public function create(): Response
    {
        $categories = Category::all(['id', 'name']);

        return Inertia::render('Writer/CreateArticle', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a new article
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Article::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        $draftStatus = ArticleStatus::where('name', 'Draft')->first();

        Article::create([
            'title' => $validated['title'],
            'slug' => str()->slug($validated['title']),
            'content' => $validated['content'],
            'writer_id' => Auth::id(),
            'category_id' => $validated['category_id'],
            'status_id' => $draftStatus->id,
        ]);

        return redirect()->route('writer.dashboard')->with('success', 'Article created successfully.');
    }

    /**
     * Show edit article form
     */
    public function edit(Article $article): Response
    {
        $this->authorize('edit', $article);

        $categories = Category::all(['id', 'name']);

        return Inertia::render('Writer/EditArticle', [
            'article' => $article->load(['status', 'category']),
            'categories' => $categories,
        ]);
    }

    /**
     * Update article
     */
    public function update(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('edit', $article);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        $article->update([
            'title' => $validated['title'],
            'slug' => str()->slug($validated['title']),
            'content' => $validated['content'],
            'category_id' => $validated['category_id'],
        ]);

        return redirect()->route('writer.dashboard')->with('success', 'Article updated successfully.');
    }

    /**
     * Submit article for review
     */
    public function submit(Article $article): RedirectResponse
    {
        $this->authorize('submit', $article);

        $submittedStatus = ArticleStatus::where('name', 'Submitted')->first();

        $article->update([
            'status_id' => $submittedStatus->id,
        ]);

        return redirect()->route('writer.dashboard')->with('success', 'Article submitted for review.');
    }

    /**
     * Delete article
     */
    public function destroy(Article $article): RedirectResponse
    {
        $this->authorize('delete', $article);

        $article->delete();

        return redirect()->route('writer.dashboard')->with('success', 'Article deleted successfully.');
    }
}
