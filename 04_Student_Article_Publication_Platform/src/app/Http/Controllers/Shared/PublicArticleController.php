<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Inertia\Inertia;
use Inertia\Response;

class PublicArticleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/ArticlesIndex', [
            'articles' => Article::query()
                ->with(['author:id,name', 'category:id,name'])
                ->withCount('comments')
                ->whereNotNull('published_at')
                ->where('is_public', true)
                ->latest('public_approved_at')
                ->latest('published_at')
                ->get(),
        ]);
    }

    public function show(Article $article): Response
    {
        abort_unless($article->published_at !== null && $article->is_public, 404);

        return Inertia::render('Public/ArticleShow', [
            'article' => $article->load([
                'author:id,name',
                'category:id,name',
                'comments.user:id,name',
            ]),
        ]);
    }
}
