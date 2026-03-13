<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Comment;
use App\Notifications\CommentPostedNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /**
     * Show student dashboard with published articles
     */
    public function dashboard(): Response
    {
        $publishedStatus = ArticleStatus::where('name', 'Published')->first();

        $articles = Article::where('status_id', $publishedStatus->id)
            ->with(['writer', 'category', 'comments' => function ($query) {
                $query->latest();
            }])
            ->latest()
            ->paginate(10);

        return Inertia::render('Student/Dashboard', [
            'articles' => $articles,
        ]);
    }

    /**
     * Show individual article with comments
     */
    public function show(Article $article): Response
    {
        if (!$article->isPublished()) {
            abort(403, 'This article is not available for viewing.');
        }

        return Inertia::render('Student/ArticleDetail', [
            'article' => $article->load(['writer', 'category', 'comments' => function ($query) {
                $query->with('student')->latest();
            }]),
        ]);
    }

    /**
     * Store a new comment
     */
    public function storeComment(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('create', [Comment::class, $article]);

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = Comment::create([
            'article_id' => $article->id,
            'student_id' => Auth::id(),
            'content' => $validated['content'],
        ]);

        $article->writer->notify(new CommentPostedNotification($comment->load(['article', 'student'])));

        return redirect()->route('student.show', $article)->with('success', 'Comment posted successfully.');
    }

    /**
     * Delete a comment
     */
    public function deleteComment(Comment $comment): RedirectResponse
    {
        $this->authorize('delete', $comment);

        $articleId = $comment->article_id;
        $comment->delete();

        return redirect()->route('student.show', $articleId)->with('success', 'Comment deleted successfully.');
    }
}
