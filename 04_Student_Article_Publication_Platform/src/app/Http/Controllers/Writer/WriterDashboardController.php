<?php

namespace App\Http\Controllers\Writer;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\SubmissionDeadline;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class WriterDashboardController extends Controller
{
    private function computePersonalAnalytics(User $user): array
    {
        $statusIds = ArticleStatus::query()
            ->whereIn('slug', ['submitted', 'revision-requested', 'published'])
            ->pluck('id')
            ->all();

        $submittedQuery = $user->articles()->whereIn('article_status_id', $statusIds);
        $submittedCount = (clone $submittedQuery)->count();

        $publishedStatusId = ArticleStatus::query()->where('slug', 'published')->value('id');
        $publishedCount = $publishedStatusId ? $user->articles()->where('article_status_id', $publishedStatusId)->count() : 0;

        $avgFeedbackSeconds = (clone $submittedQuery)
            ->with(['revisions' => fn ($q) => $q->select(['id', 'article_id', 'created_at'])->oldest()])
            ->get()
            ->map(function (Article $article): ?int {
                if ($article->submitted_at === null) {
                    return null;
                }

                $firstRevisionAt = $article->revisions->first()?->created_at;
                $publishedAt = $article->published_at;

                $firstFeedbackAt = collect([$firstRevisionAt, $publishedAt])
                    ->filter()
                    ->sort()
                    ->first();

                if ($firstFeedbackAt === null) {
                    return null;
                }

                return $article->submitted_at->diffInSeconds($firstFeedbackAt);
            })
            ->filter()
            ->average();

        return [
            'submittedCount' => $submittedCount,
            'publishedCount' => $publishedCount,
            'acceptanceRate' => $submittedCount > 0 ? round(($publishedCount / $submittedCount) * 100, 2) : null,
            'avgEditorFeedbackHours' => $avgFeedbackSeconds !== null ? round($avgFeedbackSeconds / 3600, 2) : null,
        ];
    }

    /** Render the writer dashboard with the user's recent articles. */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $articles = $user->articles()
            ->with(['category', 'status'])
            ->latest()
            ->get();

        $personalAnalytics = $this->computePersonalAnalytics($user);

        $upcomingDeadlines = SubmissionDeadline::query()
            ->with('category:id,name')
            ->where('active', true)
            ->where('due_at', '>=', now())
            ->orderBy('due_at')
            ->limit(10)
            ->get(['id', 'title', 'category_id', 'due_at']);

        $recentCategoryId = $user->articles()
            ->whereNotNull('category_id')
            ->latest()
            ->value('category_id');

        $relatedArticles = collect();
        if ($recentCategoryId !== null) {
            $relatedArticles = Article::query()
                ->with(['author:id,name', 'category:id,name'])
                ->where('category_id', $recentCategoryId)
                ->whereNotNull('published_at')
                ->where('user_id', '!=', $user->id)
                ->latest('published_at')
                ->limit(5)
                ->get(['id', 'user_id', 'category_id', 'title', 'published_at']);
        }

        return Inertia::render('Writer/Dashboard', [
            'articles' => $articles,
            'personalAnalytics' => $personalAnalytics,
            'upcomingDeadlines' => $upcomingDeadlines,
            'relatedArticles' => $relatedArticles,
            'notifications' => $user->notifications()->latest()->limit(10)->get(),
        ]);
    }

    public function personalAnalytics(Request $request): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'personalAnalytics' => $this->computePersonalAnalytics($request->user()),
        ]);
    }
}
