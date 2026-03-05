<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StudentDashboardController extends Controller
{
    /** Render student dashboard metrics. */
    public function index(): Response
    {
        $startOfMonth = Carbon::now()->startOfMonth();

        $articles = Article::query()
            ->with([
                'category:id,name',
                'author:id,name',
                'comments.user:id,name',
                'comments.replies.user:id,name',
            ])
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
