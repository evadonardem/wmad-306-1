<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Comment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

        return Inertia::render('Student/Profile', [
            'profile' => [
                'fullName' => $user->name,
                'courseProgram' => 'Program not set',
                'yearLevel' => 'Year level not set',
                'shortBio' => 'Focused on academic reading and thoughtful participation in student journal discussions.',
                'joinedDate' => optional($user->created_at)?->toFormattedDateString(),
            ],
            'readingActivity' => [
                'totalArticlesRead' => max($commentsMade * 2, $recentlyViewed->count()),
                'totalReadingTime' => max($commentsMade * 12, 30),
                'favoriteCategory' => $favoriteCategory,
                'readingStreak' => null,
            ],
            'activityOverview' => [
                'savedArticlesCount' => 0,
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
        ]);
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
                event(new \App\Events\CommentReplied($parent, $comment));
            }
        }

        return back()->with('success', 'Comment posted successfully.');
    }
}
