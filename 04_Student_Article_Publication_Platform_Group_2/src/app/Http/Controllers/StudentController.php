<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Comment;
use App\Models\ArticleFavorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{

    /*
    |--------------------------------------------------------------------------
    | Student Dashboard
    |--------------------------------------------------------------------------
    */

    public function dashboard()
    {

        $search = request('search');

        $articles = Article::whereHas('status', function ($q) {
            $q->where('name', 'published');
        })
        ->when($search, function ($query, $search) {
            $query->where('title', 'like', "%{$search}%");
        })
        ->with(['writer','category','status'])
        ->latest()
        ->take(9) // LIMIT number of article cards shown
        ->get();


        /*
        |--------------------------------------------------------------------------
        | Statistics
        |--------------------------------------------------------------------------
        */

        $userId = Auth::id();

        $stats = [

            'articles_available' => Article::whereHas('status', function ($q) {
                $q->where('name','published');
            })->count(),

            'comments_posted' => Comment::where('student_id', $userId)->count(),

            'total_comments' => Comment::count(),

            'favorites_count' => ArticleFavorite::where('user_id', $userId)->count(),

        ];


        /*
        |--------------------------------------------------------------------------
        | Popular Articles
        |--------------------------------------------------------------------------
        */

        $popularArticles = Article::whereHas('status', function ($q) {
            $q->where('name','published');
        })
        ->with(['writer'])
        ->withCount('comments')
        ->orderByDesc('comments_count')
        ->take(5) // LIMIT trending articles
        ->get();


        return Inertia::render('Student/Dashboard', [
            'articles' => $articles,
            'stats' => $stats,
            'popularArticles' => $popularArticles,
            'search' => $search
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Student Favorites
    |--------------------------------------------------------------------------
    */

    public function favorites()
    {
        $favorites = ArticleFavorite::where('user_id', Auth::id())
            ->with(['article.writer', 'article.category', 'article.status'])
            ->latest()
            ->paginate(12);

        $favoriteArticles = $favorites->map(fn($fav) => $fav->article);

        return Inertia::render('Student/Favorites', [
            'favoriteArticles' => $favoriteArticles
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Comment on Article
    |--------------------------------------------------------------------------
    */

    public function comment(Request $request, Article $article)
    {
        $this->authorize('comment', [\App\Models\Comment::class, $article]);

        $data = $request->validate([
            'content' => 'required|string'
        ]);

        $comment = Comment::create([
            'article_id' => $article->id,
            'student_id' => Auth::id(),
            'content' => $data['content']
        ]);

        if ($article->writer) {
            $article->writer->notify(
                new \App\Notifications\CommentPostedNotification($comment)
            );
        }

        return redirect()->back()->with('success', 'Comment posted successfully.');
    }
}
