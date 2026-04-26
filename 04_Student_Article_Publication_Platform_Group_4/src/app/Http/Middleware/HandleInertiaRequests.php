<?php

namespace App\Http\Middleware;

use App\Models\Article;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $notifications = null;
        if ($user) {
            if ($user->hasRole('admin')) {
                $pendingWriterRequestsList = User::query()
                    ->whereNotNull('writer_application_submitted_at')
                    ->orderByDesc('writer_application_submitted_at')
                    ->limit(5)
                    ->get(['id', 'name', 'email', 'writer_application_submitted_at']);
                $pendingArticlesList = Schema::hasTable('articles')
                    ? Article::with('user:id,name')
                        ->where('status', 'pending')
                        ->orderByDesc('updated_at')
                        ->limit(5)
                        ->get(['id', 'title', 'status', 'user_id', 'updated_at'])
                    : collect();
                $approvedArticlesList = Schema::hasTable('articles')
                    ? Article::with('user:id,name')
                        ->where('status', 'approved')
                        ->orderByDesc('reviewed_at')
                        ->limit(5)
                        ->get(['id', 'title', 'status', 'user_id', 'reviewed_at', 'updated_at'])
                    : collect();

                $notifications = [
                    'type' => 'admin',
                    'pendingWriterRequests' => User::query()
                        ->whereNotNull('writer_application_submitted_at')
                        ->count(),
                    'pendingArticles' => Schema::hasTable('articles')
                        ? Article::where('status', 'pending')->count()
                        : 0,
                    'approvedArticles' => Schema::hasTable('articles')
                        ? Article::where('status', 'approved')->count()
                        : 0,
                    'pendingWriterRequestsList' => $pendingWriterRequestsList,
                    'pendingArticlesList' => $pendingArticlesList,
                    'approvedArticlesList' => $approvedArticlesList,
                ];
            } elseif ($user->hasRole('writer')) {
                $myPendingArticlesList = Schema::hasTable('articles')
                    ? Article::where('user_id', $user->id)
                        ->where('status', 'pending')
                        ->orderByDesc('updated_at')
                        ->limit(5)
                        ->get(['id', 'title', 'status', 'updated_at'])
                    : collect();
                $myApprovedArticlesList = Schema::hasTable('articles')
                    ? Article::where('user_id', $user->id)
                        ->where('status', 'approved')
                        ->orderByDesc('reviewed_at')
                        ->limit(5)
                        ->get(['id', 'title', 'status', 'reviewed_at', 'updated_at'])
                    : collect();
                $myRejectedArticlesList = Schema::hasTable('articles')
                    ? Article::where('user_id', $user->id)
                        ->where('status', 'rejected')
                        ->orderByDesc('reviewed_at')
                        ->limit(5)
                        ->get(['id', 'title', 'status', 'reviewed_at', 'updated_at'])
                    : collect();

                $notifications = [
                    'type' => 'writer',
                    'myPendingArticles' => Schema::hasTable('articles')
                        ? Article::where('user_id', $user->id)->where('status', 'pending')->count()
                        : 0,
                    'myApprovedArticles' => Schema::hasTable('articles')
                        ? Article::where('user_id', $user->id)->where('status', 'approved')->count()
                        : 0,
                    'myRejectedArticles' => Schema::hasTable('articles')
                        ? Article::where('user_id', $user->id)->where('status', 'rejected')->count()
                        : 0,
                    'myPendingArticlesList' => $myPendingArticlesList,
                    'myApprovedArticlesList' => $myApprovedArticlesList,
                    'myRejectedArticlesList' => $myRejectedArticlesList,
                ];
            } else {
                $latestApprovedArticlesList = Schema::hasTable('articles')
                    ? Article::with('user:id,name')
                        ->where('status', 'approved')
                        ->orderByDesc('reviewed_at')
                        ->limit(5)
                        ->get(['id', 'title', 'status', 'user_id', 'reviewed_at', 'updated_at'])
                    : collect();

                $notifications = [
                    'type' => 'student',
                    'latestApprovedArticles' => Schema::hasTable('articles')
                        ? Article::where('status', 'approved')->count()
                        : 0,
                    'latestApprovedArticlesList' => $latestApprovedArticlesList,
                ];
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'roles' => $user?->getRoleNames()->values()->all() ?? [],
                'permissions' => $user?->getAllPermissions()->pluck('name')->values()->all() ?? [],
                'notifications' => $notifications,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
