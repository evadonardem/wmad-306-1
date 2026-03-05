<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StudentDashboardController extends Controller
{
    /** Render student dashboard metrics. */
    public function index(Request $request): Response
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $userId = $request->user()?->id;
        $hasViewTable = Schema::hasTable('article_views');
        $hasStarTable = Schema::hasTable('article_stars');
        $hasSaveTable = Schema::hasTable('article_saves');

        $articlesQuery = Article::query()
            ->with([
                'category:id,name',
                'author:id,name',
                'comments.user:id,name',
                'comments.replies.user:id,name',
            ]);

        if ($hasViewTable) {
            $articlesQuery->withCount('views');
        }

        if ($hasStarTable) {
            $articlesQuery
                ->withCount('stars')
                ->withExists([
                    'stars as is_starred' => fn ($query) => $query->where('user_id', $userId),
                ]);
        }

        if ($hasSaveTable) {
            $articlesQuery->withExists([
                'saves as is_saved' => fn ($query) => $query->where('user_id', $userId),
            ]);
        }

        $articles = $articlesQuery
            ->whereNotNull('published_at')
            ->latest('published_at')
            ->limit(12)
            ->get()
            ->map(fn (Article $article) => [
                'id' => $article->id,
                'title' => $article->title,
                'excerpt' => Str::limit(strip_tags($article->content ?? ''), 220),
                'content' => $article->content,
                'category' => $article->category?->name ?? 'General',
                'commentCount' => $article->comments->count(),
                'viewCount' => (int) ($hasViewTable ? ($article->views_count ?? 0) : 0),
                'starCount' => (int) ($hasStarTable ? ($article->stars_count ?? 0) : 0),
                'isStarred' => (bool) ($hasStarTable ? ($article->is_starred ?? false) : false),
                'isSaved' => (bool) ($hasSaveTable ? ($article->is_saved ?? false) : false),
                'comments' => $article->comments->whereNull('parent_id')->map(fn ($comment) => [
                    'id' => $comment->id,
                    'body' => $comment->body,
                    'author' => $comment->user?->name ?? 'Anonymous',
                    'created_at' => optional($comment->created_at)->toIso8601String(),
                    'replies' => $comment->replies->map(fn ($reply) => [
                        'id' => $reply->id,
                        'body' => $reply->body,
                        'author' => $reply->user?->name ?? 'Anonymous',
                        'created_at' => optional($reply->created_at)->toIso8601String(),
                    ]),
                ]),
                'author' => $article->author?->name ?? 'Editorial Team',
                'publishedAt' => optional($article->published_at)->toIso8601String(),
                'tags' => $article->category?->name ? [$article->category->name] : [],
            ]);

        return Inertia::render('Student/Dashboard', [
            'publishedCount' => Article::query()->whereNotNull('published_at')->count(),
            'publishedThisMonth' => Article::query()
                ->whereNotNull('published_at')
                ->where('published_at', '>=', $startOfMonth)
                ->count(),
            'articles' => $articles,
        ]);
    }
}
