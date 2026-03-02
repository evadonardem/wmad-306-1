<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function destroy(Request $request, Comment $comment): RedirectResponse
    {
        $this->authorize('comment', $comment->article);
        $comment->delete();

        return back()->with('success', 'Comment deleted successfully.');
    }
}
