<?php

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Inertia\Inertia;
use Inertia\Response;

class EditorDashboardController extends Controller
{
    /** Render the editor dashboard with pending and published queues. */
    public function index(): Response
    {
        return Inertia::render('Editor/Dashboard', [
            // Queue of submitted articles that still need editorial action.
            'pendingArticles' => Article::query()->whereNotNull('submitted_at')->whereNull('published_at')->latest()->get(),
            // Already published internally but not yet approved for public listing.
            'publishedArticles' => Article::query()->whereNotNull('published_at')->where('is_public', false)->latest('published_at')->get(),
        ]);
    }
}
