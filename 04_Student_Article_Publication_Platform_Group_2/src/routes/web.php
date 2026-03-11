<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WriterController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ArticleController;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Article;
use App\Models\User;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\CommentModerationController;
use App\Http\Controllers\ThemeController;
use Illuminate\Support\Facades\Auth;

Route::aliasMiddleware('role', \Spatie\Permission\Middleware\RoleMiddleware::class);

/*
|--------------------------------------------------------------------------
| Public Landing Page
|--------------------------------------------------------------------------
*/

Route::get('/', function () {

    /*
    |------------------------------------------
    | Latest Published Articles
    |------------------------------------------
    */

    $latestArticles = Article::whereHas('status', function ($q) {
        $q->where('name', 'published');
    })
        ->with(['writer','category'])
        ->latest()
        ->take(6)
        ->get();


    /*
    |------------------------------------------
    | Top Writers Leaderboard
    |------------------------------------------
    */

    $topWriters = collect();

    try {
        $topWriters = User::role('writer')
            ->withCount(['writtenArticles as published_count' => function ($q) {
                $q->whereHas('status', function ($s) {
                    $s->where('name', 'published');
                });
            }])
            ->orderByDesc('published_count')
            ->take(5)
            ->get();
    } catch (\Spatie\Permission\Exceptions\RoleDoesNotExist $e) {
        // If roles are not seeded yet (e.g., in tests), skip leaderboard.
    }


    return Inertia::render('Welcome', [

        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),

        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,

        'latestArticles' => $latestArticles,
        'topWriters' => $topWriters

    ]);
});


/*
|--------------------------------------------------------------------------
| Writer Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth','role:writer'])
    ->prefix('writer')
    ->name('writer.')
    ->group(function () {

        Route::get('/dashboard', [WriterController::class, 'dashboard'])
            ->name('dashboard');

        Route::get('/analytics', [WriterController::class, 'analytics'])
            ->name('analytics');

        Route::get('/articles/create', [WriterController::class, 'create'])
            ->name('articles.create');

        Route::post('/articles', [WriterController::class, 'store'])
            ->name('articles.store');

        Route::post('/articles/{article}/submit', [WriterController::class, 'submit'])
            ->name('articles.submit');

        Route::post('/articles/{article}/revise', [WriterController::class, 'revise'])
            ->name('articles.revise');

});


/*
|--------------------------------------------------------------------------
| Editor Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth','role:editor'])
    ->prefix('editor')
    ->name('editor.')
    ->group(function () {

        // debug helper (remove before deploy)
        Route::get('/debug-published', function () {
            $ids = App\Models\Article::whereHas('status', function ($q) {
                $q->where('name','published');
            })->pluck('id');
            return response()->json(['published_ids' => $ids]);
        });

        Route::get('/dashboard', [EditorController::class, 'dashboard'])
            ->name('dashboard');

        Route::get('/articles/{article}/review', function (Article $article) {

            return Inertia::render('Editor/Review', [
                'article' => $article->load([
                    'writer',
                    'category',
                    'status',
                    'revisions'
                ])
            ]);

        })->name('articles.review');

        Route::post('/articles/{article}/revision', [EditorController::class, 'requestRevision'])
            ->name('articles.requestRevision');

        Route::post('/articles/{article}/publish', [EditorController::class, 'publish'])
            ->name('articles.publish');

        // Comment moderation
        Route::post('/comments/{comment}/flag', [CommentModerationController::class, 'flag'])
            ->name('comments.flag');
        Route::post('/comments/{comment}/approve', [CommentModerationController::class, 'approve'])
            ->name('comments.approve');
        Route::post('/comments/{comment}/reject', [CommentModerationController::class, 'reject'])
            ->name('comments.reject');
        Route::post('/comments/{comment}/pin', [CommentModerationController::class, 'pin'])
            ->name('comments.pin');

});


/*
|--------------------------------------------------------------------------
| Student Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth','role:student'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {

        Route::get('/dashboard', [StudentController::class, 'dashboard'])
            ->name('dashboard');

        Route::get('/favorites', [StudentController::class, 'favorites'])
            ->name('favorites');

        Route::post('/articles/{article}/comment', [StudentController::class, 'comment'])
            ->name('articles.comment');

});

// Allow any authenticated role to post article comments (writers/editors also)
Route::middleware(['auth'])->group(function () {
    Route::post('/articles/{article}/comment', [StudentController::class, 'comment'])
        ->name('student.articles.comment');
});


/*
|--------------------------------------------------------------------------
| Article Pages (Shared)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->hasRole('editor')) {
            return redirect()->route('editor.dashboard');
        }

        if ($user->hasRole('writer')) {
            return redirect()->route('writer.dashboard');
        }

        if ($user->hasRole('student')) {
            return redirect()->route('student.dashboard');
        }

        return redirect()->route('profile.edit');
    })->name('dashboard');
    Route::get('/articles/{article}', function (Article $article) {

        // Increment view count
        $article->increment('views_count');

        // Get related articles from same category
        $relatedArticles = Article::whereHas('status', function ($q) {
            $q->where('name', 'published');
        })
            ->where('category_id', $article->category_id)
            ->where('id', '!=', $article->id)
            ->with(['writer', 'category', 'status'])
            ->limit(3)
            ->get();

        return Inertia::render('Article/Show', [
            'article' => $article->load([
                'writer',
                'category',
                'status',
                'comments.student'
            ]),
            'relatedArticles' => $relatedArticles
        ]);

    })->name('articles.show');


    Route::get('/articles/{article}/edit', function (Article $article) {

        return Inertia::render('Article/Edit', [
            'article' => $article->load([
                'writer',
                'category',
                'status',
                'revisions' => function ($q) {
                    $q->latest()->with('editor');
                }
            ])
        ]);

    })->middleware('role:writer')->name('articles.edit');

    // Favorites
    Route::post('/articles/{article}/favorite', [FavoriteController::class, 'toggle'])
        ->name('articles.favorite');
    Route::get('/articles/{article}/is-favorited', [FavoriteController::class, 'isFavorited'])
        ->name('articles.is-favorited');

    // Delete article
    Route::delete('/articles/{article}', [ArticleController::class, 'destroy'])
        ->name('articles.destroy');

});


/*
|--------------------------------------------------------------------------
| Notifications
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    Route::post('/notifications/{id}/read', function ($id) {

        $notification = DatabaseNotification::findOrFail($id);

        if ($notification->notifiable_id === Auth::id()) {
            $notification->markAsRead();
        }

        return back();

    })->name('notifications.read');

});


/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

    Route::post('/theme/toggle', [ThemeController::class, 'toggle'])
        ->name('theme.toggle');

});


require __DIR__.'/auth.php';
