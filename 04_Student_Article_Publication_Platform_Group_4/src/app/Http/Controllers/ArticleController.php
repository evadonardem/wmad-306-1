<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    private const CATEGORIES = [
        'General',
        'Technology',
        'Science',
        'Student Life',
        'Education',
        'Campus News',
        'Opinion',
    ];

    public function index(Request $request): Response
    {
        $user = $request->user();
        $this->authorize('viewAny', Article::class);
        $selectedCategory = $request->string('category')->toString();
        $sort = $request->string('sort')->toString() ?: 'newest';
        $allowedSorts = ['newest', 'oldest', 'title_asc', 'title_desc', 'category_asc', 'category_desc'];

        if ($selectedCategory !== '' && $selectedCategory !== 'all' && ! in_array($selectedCategory, self::CATEGORIES, true)) {
            $selectedCategory = 'all';
        }

        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'newest';
        }

        $relations = ['user'];
        if (Schema::hasTable('comments')) {
            $relations[] = 'comments.user';
        }

        $query = Article::with($relations);

        if ($user->hasRole('student')) {
            $query->where('status', 'approved');
        }

        if ($user->hasRole('writer')) {
            $query->where(function ($builder) use ($user) {
                $builder
                    ->where('status', 'approved')
                    ->orWhere('user_id', $user->id);
            });
        }

        if ($selectedCategory !== '' && $selectedCategory !== 'all') {
            $query->where('category', $selectedCategory);
        }

        if ($sort === 'oldest') {
            $query->oldest();
        } elseif ($sort === 'title_asc') {
            $query->orderBy('title');
        } elseif ($sort === 'title_desc') {
            $query->orderByDesc('title');
        } elseif ($sort === 'category_asc') {
            $query->orderBy('category')->latest();
        } elseif ($sort === 'category_desc') {
            $query->orderByDesc('category')->latest();
        } else {
            $query->latest();
        }

        return Inertia::render('Articles/Index', [
            'articles' => $query->paginate(10)->withQueryString(),
            'categories' => self::CATEGORIES,
            'filters' => [
                'category' => $selectedCategory === '' ? 'all' : $selectedCategory,
                'sort' => $sort,
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Article::class);

        return Inertia::render('Articles/Create', [
            'categories' => self::CATEGORIES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Article::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => ['required', 'string', Rule::in(self::CATEGORIES)],
            'content' => 'required|string|min:20',
        ]);

        $payload = [
            'title' => $validated['title'],
            'category' => $validated['category'],
            'content' => $validated['content'],
            'user_id' => $request->user()->id,
            'status' => 'pending',
        ];

        // Backward compatibility with legacy schema that still requires `body`.
        if (Schema::hasColumn('articles', 'body')) {
            $payload['body'] = $validated['content'];
        }

        Article::create($payload);

        return redirect()->route('articles.index')->with('success', 'Article submitted for admin approval.');
    }

    public function show(Request $request, Article $article): Response
    {
        $this->authorize('view', $article);

        $relations = ['user', 'reviewer'];
        if (Schema::hasTable('comments')) {
            $relations[] = 'comments.user';
        }

        $article->load($relations);
        if (!Schema::hasTable('comments')) {
            $article->setRelation('comments', collect());
        }

        return Inertia::render('Articles/Show', [
            'article' => $article,
        ]);
    }

    public function edit(Request $request, Article $article): Response
    {
        $this->authorize('update', $article);

        return Inertia::render('Articles/Edit', [
            'article' => $article,
            'categories' => self::CATEGORIES,
        ]);
    }

    public function update(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('update', $article);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => ['required', 'string', Rule::in(self::CATEGORIES)],
            'content' => 'required|string|min:20',
        ]);

        $payload = [
            'title' => $validated['title'],
            'category' => $validated['category'],
            'content' => $validated['content'],
            'status' => 'pending',
            'reviewed_by' => null,
            'reviewed_at' => null,
        ];

        if (Schema::hasColumn('articles', 'body')) {
            $payload['body'] = $validated['content'];
        }

        $article->update($payload);

        return redirect()->route('articles.index')->with('success', 'Article updated and resubmitted for review.');
    }

    public function destroy(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('delete', $article);

        $article->delete();

        return redirect()->route('articles.index')->with('success', 'Article deleted successfully.');
    }
}
