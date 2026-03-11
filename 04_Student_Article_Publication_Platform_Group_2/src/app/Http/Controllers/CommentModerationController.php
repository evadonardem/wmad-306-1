<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentModerationController extends Controller
{
    public function flag(Comment $comment)
    {
        $this->authorize('moderate', $comment);

        $comment->update([
            'status' => 'flagged',
            'moderation_reason' => 'Flagged by editor'
        ]);

        return back()->with('success', 'Comment flagged');
    }

    public function approve(Comment $comment)
    {
        $this->authorize('moderate', $comment);

        $comment->update([
            'status' => 'approved',
            'moderation_reason' => null
        ]);

        return back()->with('success', 'Comment approved');
    }

    public function reject(Request $request, Comment $comment)
    {
        $this->authorize('moderate', $comment);

        $data = $request->validate([
            'reason' => 'required|string'
        ]);

        $comment->update([
            'status' => 'rejected',
            'moderation_reason' => $data['reason']
        ]);

        return back()->with('success', 'Comment rejected');
    }

    public function pin(Comment $comment)
    {
        $this->authorize('moderate', $comment);

        $comment->update([
            'is_pinned' => !$comment->is_pinned
        ]);

        return back()->with('success', 'Comment ' . ($comment->is_pinned ? 'pinned' : 'unpinned'));
    }
}
