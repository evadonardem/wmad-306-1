<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Notifications\CommentReplyNotification;

class StudentController extends Controller
{
    public function studentDashboard(Request $request)
    {
        $query = Article::with(['writer', 'category'])
            ->with(['comments' => function ($q) {
                $q->whereNull('parent_id')->with('user', 'replies')->latest();
            }])
            ->whereHas('status', function ($q) {
                $q->where('name', 'published');
            });

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('content', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        return Inertia::render('Student/Dashboard', [
            'articles' => $query->latest()->get(),
            'categories' => Category::all(),
            'filters' => $request->only(['search', 'category_id'])
        ]);
    }

    public function comment(Request $request, Article $article)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id'
        ]);

        $comment = Comment::create([
            'student_id' => auth()->id(),
            'article_id' => $article->id,
            'parent_id' => $validated['parent_id'] ?? null,
            'content' => $validated['content'],
        ]);

        if ($comment->parent_id) {
            $parentComment = Comment::find($comment->parent_id);
            if ($parentComment->student_id !== auth()->id()) {
                // FIXED: Now passing $article->id so the notification knows where to scroll
                $parentComment->user->notify(new CommentReplyNotification(
                    auth()->user(),
                    $article->title,
                    $article->id
                ));
            }
        }

        return back()->with('success', 'Comment posted.');
    }

    public function deleteComment(Comment $comment)
    {
        if (auth()->id() !== $comment->student_id) {
            return abort(403, 'Unauthorized action.');
        }

        $comment->delete();
        return back()->with('success', 'Comment deleted.');
    }
}
