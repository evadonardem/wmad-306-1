<?php

namespace App\Http\Controllers\Writer;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WriterDraftVersionController extends Controller
{
    public function index(Request $request, Article $article): JsonResponse
    {
        $this->authorize('update', $article);

        $versions = $article->draftVersions()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->limit(100)
            ->get(['id', 'article_id', 'user_id', 'title', 'content', 'created_at']);

        return response()->json([
            'versions' => $versions,
        ]);
    }

    public function store(Request $request, Article $article): JsonResponse
    {
        $this->authorize('update', $article);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $version = $article->draftVersions()->create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'ok' => true,
            'version' => $version->only(['id', 'title', 'content', 'created_at']),
        ]);
    }
}
