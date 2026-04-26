<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function requestWriterAccess(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user->hasRole('student')) {
            return back()->with('error', 'Only students can submit a writer application.');
        }

        $validated = $request->validate([
            'reason' => 'required|string|min:30|max:2000',
        ]);

        if ($user->writer_application_submitted_at) {
            return back()->with('success', 'Your writer application is already pending admin review.');
        }

        $user->update([
            'writer_application_reason' => $validated['reason'],
            'writer_application_submitted_at' => now(),
        ]);

        return back()->with('success', 'Your writer application was sent to the admin for approval.');
    }

    public function index(Request $request): Response
    {
        $user = $request->user();

        // Only writers require admin approval to publish.
        if ($user->hasRole('writer') && ! $user->is_approved) {
            return Inertia::render('ApprovalPending');
        }

        $role = $user->getRoleNames()->first();

        if ($user->hasRole('admin')) {
            $stats = [
                'totalArticles' => Article::count(),
                'pendingArticles' => Article::where('status', 'pending')->count(),
                'approvedArticles' => Article::where('status', 'approved')->count(),
                'totalUsers' => User::count(),
                'pendingUsers' => User::where('is_approved', false)
                    ->orWhereNotNull('writer_application_submitted_at')
                    ->count(),
            ];
        } elseif ($user->hasRole('writer')) {
            $stats = [
                'totalArticles' => Article::where('user_id', $user->id)->count(),
                'pendingArticles' => Article::where('user_id', $user->id)->where('status', 'pending')->count(),
                'approvedArticles' => Article::where('user_id', $user->id)->where('status', 'approved')->count(),
            ];
        } else {
            // Student dashboard should focus on reading + commenting activity.
            $stats = [
                'publishedArticles' => Article::where('status', 'approved')->count(),
                'myComments' => Schema::hasTable('comments')
                    ? Comment::where('user_id', $user->id)->count()
                    : 0,
            ];
        }

        $relations = ['user'];
        if (Schema::hasTable('comments')) {
            $relations[] = 'comments.user';
        }

        $articlesQuery = Article::with($relations)->latest();

        if ($user->hasRole('writer')) {
            $articlesQuery->where('user_id', $user->id);
        }

        if ($user->hasRole('student')) {
            $articlesQuery->where('status', 'approved');
        }

        return Inertia::render('Dashboard', [
            'role' => $role,
            'stats' => $stats,
            'recentArticles' => $articlesQuery->limit(5)->get(),
        ]);
    }
}
