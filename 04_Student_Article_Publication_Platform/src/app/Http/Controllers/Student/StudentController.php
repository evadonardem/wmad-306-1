<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /** Render the student article browsing page. */
    public function studentDashboard(): Response
    {
        return Inertia::render('Student/BrowseArticles', [
            'articles' => Article::query()->whereNotNull('published_at')->latest()->get(),
        ]);
    }

    /** Render a student-centered academic profile overview. */
    public function profile(Request $request): Response
    {
        $user = $request->user();
        $hasSaveTable = Schema::hasTable('article_saves');
        $hasBio = Schema::hasColumn('users', 'bio');
        $hasLocation = Schema::hasColumn('users', 'location');
        $hasPhone = Schema::hasColumn('users', 'phone');

        $commentsMade = Comment::query()
            ->where('user_id', $user->id)
            ->count();

        $favoriteCategory = Comment::query()
            ->selectRaw('categories.name as category_name, COUNT(comments.id) as total')
            ->join('articles', 'comments.article_id', '=', 'articles.id')
            ->leftJoin('categories', 'articles.category_id', '=', 'categories.id')
            ->where('comments.user_id', $user->id)
            ->groupBy('categories.name')
            ->orderByDesc('total')
            ->value('category_name') ?? 'Not enough data yet';

        $articlesSubmitted = Article::query()
            ->where('user_id', $user->id)
            ->whereNotNull('submitted_at')
            ->count();

        $articlesPublished = Article::query()
            ->where('user_id', $user->id)
            ->whereNotNull('published_at')
            ->count();

        $recentlyViewed = Article::query()
            ->with('category:id,name')
            ->whereNotNull('published_at')
            ->latest('published_at')
            ->limit(3)
            ->get()
            ->map(fn (Article $article) => [
                'id' => $article->id,
                'title' => $article->title,
                'category' => $article->category?->name ?? 'General',
            ]);

        $savedArticles = $hasSaveTable
            ? $user->savedArticles()
                ->with('category:id,name')
                ->whereNotNull('published_at')
                ->latest('article_saves.created_at')
                ->limit(12)
                ->get()
                ->map(fn (Article $article) => [
                    'id' => $article->id,
                    'title' => $article->title,
                    'category' => $article->category?->name ?? 'General',
                    'readMins' => max(1, (int) ceil(str_word_count(strip_tags($article->content ?? '')) / 200)),
                ])
            : collect();

        return Inertia::render('Student/Profile', [
            'profile' => [
                'fullName' => $user->name,
                'email' => $user->email,
                'courseProgram' => 'Program not set',
                'yearLevel' => 'Year level not set',
                'shortBio' => ($hasBio ? $user->bio : null) ?: 'Focused on academic reading and thoughtful participation in student journal discussions.',
                'location' => $hasLocation ? $user->location : null,
                'phone' => $hasPhone ? $user->phone : null,
                'joinedDate' => optional($user->created_at)?->toFormattedDateString(),
            ],
            'readingActivity' => [
                'totalArticlesRead' => max($commentsMade * 2, $recentlyViewed->count()),
                'totalReadingTime' => max($commentsMade * 12, 30),
                'favoriteCategory' => $favoriteCategory,
                'readingStreak' => null,
            ],
            'activityOverview' => [
                'savedArticlesCount' => $savedArticles->count(),
                'savedArticlesLink' => route('student.dashboard') . '?view=saved',
                'recentlyViewed' => $recentlyViewed,
                'commentsMade' => $commentsMade,
            ],
            'academicEngagement' => [
                'articlesSubmitted' => $articlesSubmitted,
                'articlesPublished' => $articlesPublished,
                'totalViews' => 0,
            ],
            'preferencesPreview' => [
                'fontSize' => 'Medium (16px)',
                'theme' => 'Light / Dark (Auto)',
                'contentDensity' => 'Comfortable',
            ],
            'savedArticles' => $savedArticles,
        ]);
    }

    /** Render student settings page. */
    public function settings(Request $request): Response
    {
        $user = $request->user();
        $hasBio = Schema::hasColumn('users', 'bio');
        $hasLocation = Schema::hasColumn('users', 'location');
        $hasPhone = Schema::hasColumn('users', 'phone');

        return Inertia::render('Student/Settings', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'bio' => $hasBio ? $user->bio : null,
                'location' => $hasLocation ? $user->location : null,
                'phone' => $hasPhone ? $user->phone : null,
            ],
        ]);
    }

    /** Update student account profile details from settings. */
    public function updateSettings(Request $request): RedirectResponse
    {
        $user = $request->user();
        $hasBio = Schema::hasColumn('users', 'bio');
        $hasLocation = Schema::hasColumn('users', 'location');
        $hasPhone = Schema::hasColumn('users', 'phone');

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
        ];

        if ($hasBio) {
            $rules['bio'] = ['nullable', 'string', 'max:1000'];
        }

        if ($hasLocation) {
            $rules['location'] = ['nullable', 'string', 'max:255'];
        }

        if ($hasPhone) {
            $rules['phone'] = ['nullable', 'string', 'max:50'];
        }

        $validated = $request->validate($rules);

        $payload = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if ($hasBio) {
            $payload['bio'] = $validated['bio'] ?? null;
        }

        if ($hasLocation) {
            $payload['location'] = $validated['location'] ?? null;
        }

        if ($hasPhone) {
            $payload['phone'] = $validated['phone'] ?? null;
        }

        $user->fill($payload);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return back()->with('success', 'Account information updated successfully.');
    }

    /** Persist a new student comment on a published article. */
    public function comment(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('comment', $article);

        $validated = $request->validate([
            'body' => ['required', 'string'],
            'parent_id' => ['nullable', 'exists:comments,id'],
        ]);

        $comment = $article->comments()->create([
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);


        if (!empty($validated['parent_id'])) {
            $parent = \App\Models\Comment::find($validated['parent_id']);
            if ($parent && $parent->user_id !== $request->user()->id) {
                // Fire event for broadcasting
                event(new \App\Events\CommentReplied($parent, $comment));
                // Send notification to the original comment's user
                $parent->user->notify(new \App\Notifications\CommentRepliedNotification($parent, $comment));
            }
        }

        return back()->with('success', 'Comment posted successfully.');
    }

    /** Persist one unique view per student/article and return latest engagement counters. */
    public function recordView(Request $request, Article $article): JsonResponse
    {
        $this->authorize('view', $article);

        if (!Schema::hasTable('article_views')) {
            return response()->json([
                'viewCount' => 0,
                'starCount' => 0,
                'isStarred' => false,
            ]);
        }

        $user = $request->user();
        $article->views()->syncWithoutDetaching([$user->id]);

        $starCount = Schema::hasTable('article_stars') ? $article->stars()->count() : 0;
        $isStarred = Schema::hasTable('article_stars')
            ? $article->stars()->where('user_id', $user->id)->exists()
            : false;

        return response()->json([
            'viewCount' => $article->views()->count(),
            'starCount' => $starCount,
            'isStarred' => $isStarred,
        ]);
    }

    /** Toggle student star on article and return latest engagement counters. */
    public function toggleStar(Request $request, Article $article): JsonResponse
    {
        $this->authorize('star', $article);

        if (!Schema::hasTable('article_stars')) {
            return response()->json([
                'viewCount' => Schema::hasTable('article_views') ? $article->views()->count() : 0,
                'starCount' => 0,
                'isStarred' => false,
            ]);
        }

        $user = $request->user();
        $alreadyStarred = $article->stars()->where('user_id', $user->id)->exists();

        if ($alreadyStarred) {
            $article->stars()->detach($user->id);
        } else {
            $article->stars()->syncWithoutDetaching([$user->id]);
        }

        return response()->json([
            'viewCount' => Schema::hasTable('article_views') ? $article->views()->count() : 0,
            'starCount' => $article->stars()->count(),
            'isStarred' => !$alreadyStarred,
        ]);
    }

    /** Toggle student save on article and return latest saved state. */
    public function toggleSave(Request $request, Article $article): JsonResponse
    {
        $this->authorize('save', $article);

        if (!Schema::hasTable('article_saves')) {
            return response()->json([
                'isSaved' => false,
            ]);
        }

        $user = $request->user();
        $alreadySaved = $article->saves()->where('user_id', $user->id)->exists();

        if ($alreadySaved) {
            $article->saves()->detach($user->id);
        } else {
            $article->saves()->syncWithoutDetaching([$user->id]);
        }

        return response()->json([
            'isSaved' => !$alreadySaved,
        ]);
    }
}
