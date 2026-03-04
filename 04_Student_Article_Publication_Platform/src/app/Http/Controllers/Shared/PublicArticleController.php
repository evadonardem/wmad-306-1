<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Inertia\Inertia;
use Inertia\Response;

class PublicArticleController extends Controller
{
    /** Render the public article index with approved published content. */
    public function index(): Response
    {
        return Inertia::render('Public/ArticlesIndex', [
            // Public listing includes only editor-approved published articles.
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

    /** Render a single public article when visibility requirements are met. */
    public function show(Article $article): Response
    {
        // Prevent direct URL access to unpublished or non-public content.
        abort_unless($article->published_at !== null && $article->is_public, 404);

        return Inertia::render('Public/ArticleShow', [
            // Eager-load presentation data used by the public detail page.
            'article' => $article->load([
                'author:id,name',
                'category:id,name',
                'comments.user:id,name',
            ]),
        ]);
    }
}
