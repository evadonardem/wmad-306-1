<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class StudentController extends Controller
{
    use AuthorizesRequests;

    public function studentDashboard()
    {
        $publishedStatus = ArticleStatus::where('name', 'published')->first();

        // Students only see published articles, including the comments on them
        $articles = Article::with(['writer', 'category', 'comments.student'])
            ->where('status_id', $publishedStatus->id)
            ->latest()
            ->get();

        return Inertia::render('Student/Dashboard', ['articles' => $articles]);
    }

    public function comment(Request $request, Article $article)
    {
        $this->authorize('comment', $article);

        $validated = $request->validate(['content' => 'required|string']);

        Comment::create([
            'article_id' => $article->id,
            'student_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        return back()->with('success', 'Comment posted!');
    }
}
