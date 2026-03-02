<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function studentDashboard(): Response
    {
        return Inertia::render('Student/BrowseArticles', [
            'articles' => Article::query()->whereNotNull('published_at')->latest()->get(),
        ]);
    }

    public function comment(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('comment', $article);

        $validated = $request->validate([
            'body' => ['required', 'string'],
        ]);

        $article->comments()->create([
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
        ]);

        return back()->with('success', 'Comment posted successfully.');
    }
}
