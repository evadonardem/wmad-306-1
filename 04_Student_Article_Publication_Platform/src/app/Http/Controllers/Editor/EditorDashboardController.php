<?php

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\EditorialActionLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response;

class EditorDashboardController extends Controller
{
    /** Render the editor dashboard with actionable queue, claimed items, and published list. */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $submittedStatusId = ArticleStatus::query()->where('slug', 'submitted')->value('id');

        $queueQuery = Article::query()
            ->with(['author:id,name', 'category:id,name', 'status:id,name,slug', 'claimedByEditor:id,name'])
            ->withCount('comments')
            ->where('user_id', '!=', $user->id)
            ->whereNull('published_at')
            ->whereNull('claimed_by_editor_id');

        if ($submittedStatusId) {
            $queueQuery->where('article_status_id', $submittedStatusId);
        } else {
            $queueQuery->whereNotNull('submitted_at');
        }

        $myClaimsQuery = Article::query()
            ->with(['author:id,name', 'category:id,name', 'status:id,name,slug', 'claimedByEditor:id,name'])
            ->withCount('comments')
            ->where('claimed_by_editor_id', $user->id)
            ->whereNull('published_at');

        if ($submittedStatusId) {
            $myClaimsQuery->where('article_status_id', $submittedStatusId);
        } else {
            $myClaimsQuery->whereNotNull('submitted_at');
        }

        $queueArticles = $queueQuery->latest('submitted_at')->limit(50)->get();
        $myClaimedArticles = $myClaimsQuery->latest('claimed_at')->limit(50)->get();

        return Inertia::render('Editor/Dashboard', [
            'queueArticles' => $queueArticles,
            'myClaimedArticles' => $myClaimedArticles,
            'kpis' => [
                'queueCount' => $queueArticles->count(),
                'myClaimsCount' => $myClaimedArticles->count(),
            ],
            'availableRoles' => $user->getRoleNames()->values(),
        ]);
    }

    /** Render a full editorial tracking table with filters/search/sorting/pagination. */
    public function tracking(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $status = (string) $request->query('status', 'all');
        $authorId = (int) $request->query('author', 0);
        $reviewerId = (int) $request->query('reviewer', 0);
        $dateField = (string) $request->query('date_field', 'activity');
        $dateFrom = (string) $request->query('date_from', '');
        $dateTo = (string) $request->query('date_to', '');
        $sort = (string) $request->query('sort', 'activity_newest');
        $perPage = (int) $request->query('per_page', 10);

        $status = Arr::first(
            ['all', 'pending_review', 'in_review', 'returned_for_revision', 'rejected', 'published'],
            fn (string $value) => $value === $status
        ) ?? 'all';
        $dateField = Arr::first(
            ['activity', 'submitted', 'reviewed', 'published'],
            fn (string $value) => $value === $dateField
        ) ?? 'activity';
        $sort = Arr::first(
            [
                'activity_newest',
                'activity_oldest',
                'title_asc',
                'title_desc',
                'submitted_newest',
                'submitted_oldest',
                'review_newest',
                'review_oldest',
                'publish_newest',
                'publish_oldest',
                'status_asc',
                'status_desc',
            ],
            fn (string $value) => $value === $sort
        ) ?? 'activity_newest';
        $perPage = in_array($perPage, [10, 25, 50], true) ? $perPage : 10;

        $submittedStatusId = ArticleStatus::query()->where('slug', 'submitted')->value('id');
        $revisionStatusId = ArticleStatus::query()->where('slug', 'revision-requested')->value('id');
        $rejectedStatusId = ArticleStatus::query()->where('slug', 'rejected')->value('id');
        $publishedStatusId = ArticleStatus::query()->where('slug', 'published')->value('id');

        $latestLogIds = EditorialActionLog::query()
            ->selectRaw('MAX(id) as id, article_id')
            ->groupBy('article_id');

        $query = Article::query()
            ->leftJoinSub($latestLogIds, 'latest_log_ids', function ($join): void {
                $join->on('latest_log_ids.article_id', '=', 'articles.id');
            })
            ->leftJoin('editorial_action_logs as latest_log', 'latest_log.id', '=', 'latest_log_ids.id')
            ->leftJoin('users as reviewers', 'reviewers.id', '=', 'latest_log.acting_user_id')
            ->with(['author:id,name', 'status:id,name,slug'])
            ->select('articles.*')
            ->selectRaw('latest_log.acting_user_id as reviewer_id')
            ->selectRaw('reviewers.name as reviewer_name')
            ->selectRaw('latest_log.created_at as review_date')
            ->selectSub(
                EditorialActionLog::query()
                    ->select('created_at')
                    ->whereColumn('article_id', 'articles.id')
                    ->where('action', 'returned_for_revision')
                    ->latest('id')
                    ->limit(1),
                'revision_returned_at'
            )
            ->selectSub(
                EditorialActionLog::query()
                    ->select('created_at')
                    ->whereColumn('article_id', 'articles.id')
                    ->where('action', 'rejected_entry')
                    ->latest('id')
                    ->limit(1),
                'rejected_action_at'
            );

        if ($search !== '') {
            $query->where('articles.title', 'like', '%'.$search.'%');
        }

        if ($authorId > 0) {
            $query->where('articles.user_id', $authorId);
        }

        if ($reviewerId > 0) {
            $query->where('latest_log.acting_user_id', $reviewerId);
        }

        if ($status !== 'all') {
            switch ($status) {
                case 'pending_review':
                    $query->whereNull('articles.published_at')->whereNull('articles.claimed_by_editor_id');
                    if ($submittedStatusId) {
                        $query->where('articles.article_status_id', $submittedStatusId);
                    } else {
                        $query->whereNotNull('articles.submitted_at');
                    }
                    break;
                case 'in_review':
                    $query->whereNull('articles.published_at')->whereNotNull('articles.claimed_by_editor_id');
                    if ($submittedStatusId) {
                        $query->where('articles.article_status_id', $submittedStatusId);
                    } else {
                        $query->whereNotNull('articles.submitted_at');
                    }
                    break;
                case 'returned_for_revision':
                    if ($revisionStatusId) {
                        $query->where('articles.article_status_id', $revisionStatusId);
                    } else {
                        $query->whereNotNull('articles.editorial_decision_notes');
                    }
                    break;
                case 'rejected':
                    if ($rejectedStatusId) {
                        $query->where('articles.article_status_id', $rejectedStatusId);
                    } else {
                        $query->whereNotNull('articles.rejected_at');
                    }
                    break;
                case 'published':
                    $query->whereNotNull('articles.published_at');
                    if ($publishedStatusId) {
                        $query->where('articles.article_status_id', $publishedStatusId);
                    }
                    break;
            }
        }

        if ($dateFrom !== '' || $dateTo !== '') {
            $from = $dateFrom !== '' ? Carbon::parse($dateFrom)->startOfDay() : null;
            $to = $dateTo !== '' ? Carbon::parse($dateTo)->endOfDay() : null;

            $column = match ($dateField) {
                'submitted' => 'articles.submitted_at',
                'reviewed' => 'latest_log.created_at',
                'published' => 'articles.published_at',
                default => null,
            };

            if ($column) {
                if ($from) {
                    $query->where($column, '>=', $from);
                }
                if ($to) {
                    $query->where($column, '<=', $to);
                }
            } else {
                if ($from) {
                    $query->whereRaw(
                        'COALESCE(latest_log.created_at, articles.published_at, articles.rejected_at, articles.submitted_at, articles.updated_at) >= ?',
                        [$from]
                    );
                }
                if ($to) {
                    $query->whereRaw(
                        'COALESCE(latest_log.created_at, articles.published_at, articles.rejected_at, articles.submitted_at, articles.updated_at) <= ?',
                        [$to]
                    );
                }
            }
        }

        switch ($sort) {
            case 'title_asc':
                $query->orderBy('articles.title', 'asc');
                break;
            case 'title_desc':
                $query->orderBy('articles.title', 'desc');
                break;
            case 'submitted_newest':
                $query->orderBy('articles.submitted_at', 'desc');
                break;
            case 'submitted_oldest':
                $query->orderBy('articles.submitted_at', 'asc');
                break;
            case 'review_newest':
                $query->orderBy('latest_log.created_at', 'desc');
                break;
            case 'review_oldest':
                $query->orderBy('latest_log.created_at', 'asc');
                break;
            case 'publish_newest':
                $query->orderBy('articles.published_at', 'desc');
                break;
            case 'publish_oldest':
                $query->orderBy('articles.published_at', 'asc');
                break;
            case 'status_asc':
                $query->orderBy('articles.article_status_id', 'asc');
                break;
            case 'status_desc':
                $query->orderBy('articles.article_status_id', 'desc');
                break;
            case 'activity_oldest':
                $query->orderByRaw(
                    'COALESCE(latest_log.created_at, articles.published_at, articles.rejected_at, articles.submitted_at, articles.updated_at) asc'
                );
                break;
            case 'activity_newest':
            default:
                $query->orderByRaw(
                    'COALESCE(latest_log.created_at, articles.published_at, articles.rejected_at, articles.submitted_at, articles.updated_at) desc'
                );
                break;
        }

        $records = $query->paginate($perPage)->withQueryString();

        $rows = $records->getCollection()->map(function (Article $article): array {
            $statusSlug = $article->status?->slug;
            $workflowStatus = match (true) {
                $article->published_at !== null => 'published',
                $statusSlug === 'rejected' => 'rejected',
                $statusSlug === 'revision-requested' => 'returned_for_revision',
                $article->claimed_by_editor_id !== null => 'in_review',
                default => 'pending_review',
            };

            return [
                'id' => $article->id,
                'title' => $article->title,
                'author' => [
                    'id' => $article->author?->id,
                    'name' => $article->author?->name,
                ],
                'reviewer' => [
                    'id' => $article->reviewer_id ? (int) $article->reviewer_id : null,
                    'name' => $article->reviewer_name ?: null,
                ],
                'status' => [
                    'slug' => $article->status?->slug,
                    'name' => $article->status?->name,
                    'workflow' => $workflowStatus,
                ],
                'submitted_at' => $article->submitted_at,
                'reviewed_at' => $article->review_date,
                'published_at' => $article->published_at,
                'revision_returned_at' => $article->revision_returned_at,
                'rejected_at' => $article->rejected_action_at ?: $article->rejected_at,
                'decision_note' => $article->editorial_decision_notes,
                'is_public' => (bool) $article->is_public,
            ];
        });

        $records->setCollection($rows);

        return Inertia::render('Editor/Tracking', [
            'records' => $records,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'author' => $authorId > 0 ? (string) $authorId : '',
                'reviewer' => $reviewerId > 0 ? (string) $reviewerId : '',
                'date_field' => $dateField,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'sort' => $sort,
                'per_page' => $perPage,
            ],
            'statusOptions' => [
                ['value' => 'all', 'label' => 'All statuses'],
                ['value' => 'pending_review', 'label' => 'Pending Review'],
                ['value' => 'in_review', 'label' => 'In Review'],
                ['value' => 'returned_for_revision', 'label' => 'Returned for Revision'],
                ['value' => 'rejected', 'label' => 'Rejected'],
                ['value' => 'published', 'label' => 'Published'],
            ],
            'authorOptions' => User::query()
                ->role('writer')
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (User $user): array => ['value' => (string) $user->id, 'label' => $user->name])
                ->values(),
            'reviewerOptions' => User::query()
                ->role('editor')
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (User $user): array => ['value' => (string) $user->id, 'label' => $user->name])
                ->values(),
            'dateFieldOptions' => [
                ['value' => 'activity', 'label' => 'Any Activity Date'],
                ['value' => 'submitted', 'label' => 'Submission Date'],
                ['value' => 'reviewed', 'label' => 'Review Date'],
                ['value' => 'published', 'label' => 'Publish Date'],
            ],
            'sortOptions' => [
                ['value' => 'activity_newest', 'label' => 'Newest activity'],
                ['value' => 'activity_oldest', 'label' => 'Oldest activity'],
                ['value' => 'title_asc', 'label' => 'Title A-Z'],
                ['value' => 'title_desc', 'label' => 'Title Z-A'],
                ['value' => 'submitted_newest', 'label' => 'Submission newest'],
                ['value' => 'submitted_oldest', 'label' => 'Submission oldest'],
                ['value' => 'review_newest', 'label' => 'Review newest'],
                ['value' => 'review_oldest', 'label' => 'Review oldest'],
                ['value' => 'publish_newest', 'label' => 'Publish newest'],
                ['value' => 'publish_oldest', 'label' => 'Publish oldest'],
                ['value' => 'status_asc', 'label' => 'Status A-Z'],
                ['value' => 'status_desc', 'label' => 'Status Z-A'],
            ],
            'availableRoles' => $request->user()->getRoleNames()->values(),
        ]);
    }

    /** Render a dedicated published-articles view for editor operations. */
    public function published(Request $request): Response
    {
        $publishedStatusId = ArticleStatus::query()->where('slug', 'published')->value('id');

        $publishedQuery = Article::query()
            ->with([
                'author:id,name',
                'category:id,name',
                'status:id,name,slug',
                'publicApprover:id,name',
                'editorialLogs' => fn ($query) => $query->with('actor:id,name')->latest(),
            ])
            ->withCount('comments')
            ->whereNotNull('published_at');

        if ($publishedStatusId) {
            $publishedQuery->where('article_status_id', $publishedStatusId);
        }

        $publishedArticles = $publishedQuery->latest('published_at')->limit(150)->get();

        return Inertia::render('Editor/Published', [
            'publishedArticles' => $publishedArticles,
            'kpis' => [
                'publishedCount' => $publishedArticles->count(),
                'publicApprovedCount' => $publishedArticles->where('is_public', true)->count(),
                'internalOnlyCount' => $publishedArticles->where('is_public', false)->count(),
            ],
            'availableRoles' => $request->user()->getRoleNames()->values(),
        ]);
    }
}
