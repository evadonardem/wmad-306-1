<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Comment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class CommentController extends Controller
{
    public function store(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('view', $article);

        if (! Schema::hasTable('comments')) {
            return back()->with('error', 'Comments are not ready yet. Please run migrations first.');
        }

        $validated = $request->validate([
            'content' => 'required|string|min:2|max:1000',
        ]);

        $article->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        return back()->with('success', 'Comment added successfully.');
    }

    public function destroy(Request $request, Comment $comment): RedirectResponse
    {
        $user = $request->user();
        $comment->loadMissing('article');

        $canDelete = $user->hasRole('admin')
            || $user->id === $comment->user_id
            || ($user->hasRole('writer') && $comment->article && $comment->article->user_id === $user->id);

        if (! $canDelete) {
            return back()->with('error', 'You are not allowed to delete this comment.');
        }

        $comment->delete();

        return back()->with('success', 'Comment deleted successfully.');
    }
}
