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
                // Only load top-level comments; replies are loaded recursively
                $q->whereNull('parent_id')->with('user', 'replies')->latest();
            }])
            ->whereHas('status', function ($q) {
                $q->where('name', 'published');
            });

        // Search Filter
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('content', 'like', '%' . $request->search . '%');
        }

        // Category Filter
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
            'student_id' => auth()->id(), // FIXED: Saving as student_id
            'article_id' => $article->id,
            'parent_id' => $validated['parent_id'] ?? null,
            'content' => $validated['content'],
        ]);

        // If this is a reply, notify the original commenter
        if ($comment->parent_id) {
            $parentComment = Comment::find($comment->parent_id);
            if ($parentComment->student_id !== auth()->id()) { // FIXED: Checking student_id
                $parentComment->user->notify(new CommentReplyNotification(auth()->user(), $article->title));
            }
        }

        return back()->with('success', 'Comment posted.');
    }

    public function deleteComment(Comment $comment)
    {
        // Security check: Only the owner can delete their comment
        if (auth()->id() !== $comment->student_id) { // FIXED: Checking student_id
            return abort(403, 'Unauthorized action.');
        }

        $comment->delete(); // This will cascade and delete all replies to this comment too
        return back()->with('success', 'Comment deleted.');
    }
}
