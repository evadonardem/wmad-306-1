<?php

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Inertia\Inertia;
use Inertia\Response;

class EditorDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Editor/Dashboard', [
            'pendingArticles' => Article::query()->whereNotNull('submitted_at')->whereNull('published_at')->latest()->get(),
            'publishedArticles' => Article::query()->whereNotNull('published_at')->where('is_public', false)->latest('published_at')->get(),
        ]);
    }
}
