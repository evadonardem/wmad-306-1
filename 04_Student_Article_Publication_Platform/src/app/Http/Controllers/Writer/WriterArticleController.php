<?php

namespace App\Http\Controllers\Writer;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WriterArticleController extends Controller
{
    public function create(Request $request): Response
    {
        return Inertia::render('Writer/CreateArticle', [
            'categories' => Category::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function edit(Request $request, Article $article): Response
    {
        $this->authorize('update', $article);

        return Inertia::render('Writer/EditArticle', [
            'article' => $article->load(['category', 'status']),
            'categories' => Category::query()->orderBy('name')->get(['id', 'name']),
            'initialDraftVersions' => $article->draftVersions()
                ->latest()
                ->limit(20)
                ->get(['id', 'article_id', 'user_id', 'title', 'content', 'created_at']),
        ]);
    }

    public function update(Request $request, Article $article): JsonResponse|RedirectResponse
    {
        $this->authorize('update', $article);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category_id' => ['nullable', 'exists:categories,id'],
        ]);

        $article->update($validated);

        if ($request->expectsJson()) {
            return response()->json([
                'ok' => true,
                'savedAt' => now()->toISOString(),
            ]);
        }

        return back()->with('success', 'Draft saved successfully.');
    }
}
