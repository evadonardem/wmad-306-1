<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Shared\PublicArticleController;
use App\Models\Article;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $recentArticles = Article::query()
        ->with(['author:id,name', 'category:id,name'])
        ->withCount('comments')
        ->whereNotNull('published_at')
        ->where('is_public', true)
        ->latest('public_approved_at')
        ->latest('published_at')
        ->limit(6)
        ->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'recentArticles' => $recentArticles,
    ]);
});

Route::get('/articles', [PublicArticleController::class, 'index'])->name('public.articles.index');
Route::get('/articles/{article}', [PublicArticleController::class, 'show'])->name('public.articles.show');

Route::get('/dashboard', function () {
    $user = request()->user();

    if ($user?->hasRole('admin')) {
        return redirect()->route('admin.dashboard');
    }

    if ($user?->hasRole('writer')) {
        return redirect()->route('writer.dashboard');
    }

    if ($user?->hasRole('editor')) {
        return redirect()->route('editor.dashboard');
    }

    if ($user?->hasRole('student')) {
        return redirect()->route('student.dashboard');
    }

    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
require __DIR__.'/sample.php';
require __DIR__.'/writer.php';
require __DIR__.'/editor.php';
require __DIR__.'/student.php';
require __DIR__.'/admin.php';
