<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ArticleController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/dashboard');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::resource('articles', ArticleController::class)
    ->only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

Route::post('articles/{article}/submit', [ArticleController::class, 'submit'])
    ->name('articles.submit')
    ->middleware(['auth', 'verified']);

Route::post('articles/{article}/unsubmit', [ArticleController::class, 'unsubmit'])
    ->name('articles.unsubmit')
    ->middleware(['auth', 'verified']);

Route::get('admin/articles', [ArticleController::class, 'admin'])
    ->name('articles.admin')
    ->middleware(['auth', 'verified']);

Route::patch('/articles/{article}/status', [ArticleController::class, 'updateStatus'])
    ->name('articles.updateStatus')
    ->middleware(['auth', 'verified']);

require __DIR__.'/auth.php';
require __DIR__.'/sample.php';
