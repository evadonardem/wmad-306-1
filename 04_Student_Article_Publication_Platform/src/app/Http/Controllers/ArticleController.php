<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::with('user')
            ->when(Auth::user()->hasRole('student'), function ($query) {
                return $query->where('user_id', Auth::id());
            });

        // Handle search
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('content', 'like', "%{$searchTerm}%");
            });
        }

        $articles = $query->latest()->paginate(10);

        return Inertia::render('Articles/Index', [
            'articles' => $articles,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Articles/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
        ]);

        $article = Article::create([
            ...$validated,
            'user_id' => Auth::id(),
            'published_at' => $validated['status'] === 'published' ? now() : null,
        ]);

        return redirect()->route('articles.show', $article)->with('success', 'Article created successfully!');
    }

    public function show(Article $article)
    {
        $this->authorize('view', $article);

        return Inertia::render('Articles/Show', [
            'article' => $article->load('user'),
        ]);
    }

    public function edit(Article $article)
    {
        $this->authorize('update', $article);

        return Inertia::render('Articles/Edit', [
            'article' => $article,
        ]);
    }

    public function update(Request $request, Article $article)
    {
        $this->authorize('update', $article);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
        ]);

        $article->update([
            ...$validated,
            'published_at' => $validated['status'] === 'published' && $article->status !== 'published' ? now() : $article->published_at,
        ]);

        return redirect()->route('articles.show', $article)->with('success', 'Article updated successfully!');
    }

    public function destroy(Article $article)
    {
        $this->authorize('delete', $article);

        $article->delete();

        return redirect()->route('articles.index')->with('success', 'Article deleted successfully!');
    }

    public function search(Request $request, $query)
    {
        $articles = Article::with('user')
            ->where('title', 'like', "%{$query}%")
            ->orWhere('content', 'like', "%{$query}%")
            ->when(Auth::user()->hasRole('student'), function ($query) {
                return $query->where('user_id', Auth::id());
            })
            ->published()
            ->latest()
            ->paginate(10);

        return response()->json($articles);
    }
}