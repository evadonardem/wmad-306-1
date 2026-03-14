<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\Comment;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response;

class PublicArticleController extends Controller
{
    /** Render the article index with visibility based on request context. */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $sort = (string) $request->query('sort', 'date_newest');
        $sort = Arr::first(
            ['title_asc', 'title_desc', 'date_newest', 'date_oldest'],
            fn (string $value) => $value === $sort
        ) ?? 'date_newest';
        $categoryId = (int) $request->query('category', 0);
        $year = (int) $request->query('year', 0);
        $visibility = (string) $request->query('visibility', 'all');
        $visibility = Arr::first(['all', 'public', 'private'], fn (string $value) => $value === $visibility) ?? 'all';
        $canViewNonPublic = $this->canViewNonPublic($request);

        $query = Article::query()
            ->with([
                'author:id,name',
                'category:id,name',
                'comments' => fn ($q) => $q->with('user:id,name')->latest(),
            ])
            ->withCount('comments')
            ->whereNotNull('published_at');

        if (!$canViewNonPublic) {
            $query->where('is_public', true);
        } else {
            if ($visibility === 'public') {
                $query->where('is_public', true);
            } elseif ($visibility === 'private') {
                $query->where('is_public', false);
            }
        }

        if ($search !== '') {
            $query->where('title', 'like', '%'.$search.'%');
        }

        if ($categoryId > 0) {
            $query->where('category_id', $categoryId);
        }

        if ($year > 0) {
            $query->whereYear('published_at', $year);
        }

        switch ($sort) {
            case 'title_asc':
                $query->orderBy('title', 'asc')->orderByDesc('published_at');
                break;
            case 'title_desc':
                $query->orderBy('title', 'desc')->orderByDesc('published_at');
                break;
            case 'date_oldest':
                $query->orderBy('published_at', 'asc')->orderBy('title', 'asc');
                break;
            case 'date_newest':
            default:
                $query->orderBy('published_at', 'desc')->orderBy('title', 'asc');
                break;
        }

        $categories = Category::query()
            ->whereIn(
                'id',
                Article::query()
                    ->whereNotNull('published_at')
                    ->when(!$canViewNonPublic, fn ($q) => $q->where('is_public', true))
                    ->select('category_id')
                    ->whereNotNull('category_id')
            )
            ->orderBy('name')
            ->get(['id', 'name']);

        $yearRows = Article::query()
            ->whereNotNull('published_at')
            ->when(!$canViewNonPublic, fn ($q) => $q->where('is_public', true))
            ->get(['published_at']);

        $years = $yearRows
            ->pluck('published_at')
            ->filter()
            ->map(fn ($publishedAt) => Carbon::parse($publishedAt)->year)
            ->unique()
            ->sortDesc()
            ->values();

        return Inertia::render('Public/ArticlesIndex', [
            'articles' => $query->get(),
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'category' => $categoryId > 0 ? (string) $categoryId : '',
                'year' => $year > 0 ? (string) $year : '',
                'visibility' => $canViewNonPublic ? $visibility : 'public',
            ],
            'categories' => $categories,
            'years' => $years,
            'visibilityScope' => $canViewNonPublic ? 'published_all' : 'public_only',
            ...$this->resolveBackNavigation($request),
        ]);
    }

    /** Render a single article when visibility requirements are met. */
    public function show(Request $request, Article $article): Response
    {
        abort_unless($this->canViewArticle($request, $article), 404);

        return Inertia::render('Public/ArticleShow', [
            'article' => $article->load([
                'author:id,name',
                'category:id,name',
                'comments' => fn ($query) => $query->with('user:id,name')->latest(),
            ]),
            'visibilityScope' => $this->canViewNonPublic($request) ? 'published_all' : 'public_only',
        ]);
    }

    /** Allow authenticated users to comment on articles they can view. */
    public function comment(Request $request, Article $article): RedirectResponse
    {
        abort_unless($this->canViewArticle($request, $article), 404);
        $this->authorize('comment', $article);

        $validated = $request->validate([
            'body' => [
                'required',
                'string',
                'min:2',
                'max:1000',
                // Basic anti-spam gate: reject links in first-party comments.
                'not_regex:/https?:\/\/|www\./i',
            ],
            'parent_id' => ['nullable', 'exists:comments,id'],
        ]);

        if (!empty($validated['parent_id'])) {
            $parentComment = Comment::query()->find($validated['parent_id']);
            if (!$parentComment || (int) $parentComment->article_id !== (int) $article->id) {
                return back()->withErrors([
                    'body' => 'Invalid parent comment selection.',
                ]);
            }
        }

        $article->comments()->create([
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        return back()->with('success', 'Comment posted successfully.');
    }

    private function canViewNonPublic(Request $request): bool
    {
        return (bool) $request->user();
    }

    private function canViewArticle(Request $request, Article $article): bool
    {
        if ($article->published_at === null) {
            return false;
        }

        if ($this->canViewNonPublic($request)) {
            return true;
        }

        return (bool) $article->is_public;
    }

    private function resolveBackNavigation(Request $request): array
    {
        if ($request->user()) {
            return [
                'backUrl' => route('dashboard'),
                'backLabel' => 'BACK',
            ];
        }

        return [
            'backUrl' => '/',
            'backLabel' => 'BACK',
        ];
    }
}
