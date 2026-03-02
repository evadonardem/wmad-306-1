<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function show(Article $article): Response
    {
        return Inertia::render('Student/ArticleView', [
            'article' => $article->load(['author', 'category', 'comments.user']),
        ]);
    }
}
