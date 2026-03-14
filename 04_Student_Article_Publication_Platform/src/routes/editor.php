<?php

use App\Http\Controllers\Editor\EditorController;
use App\Http\Controllers\Editor\EditorDashboardController;
use Illuminate\Support\Facades\Route;

// Register editor-only review and publication routes.
Route::middleware(['auth', 'verified', 'role:editor'])
    ->prefix('editor')
    ->as('editor.')
    ->group(function (): void {
        Route::get('/dashboard', [EditorDashboardController::class, 'index'])->name('dashboard');
        Route::get('/tracking', [EditorDashboardController::class, 'tracking'])->name('tracking.index');
        Route::get('/published', [EditorDashboardController::class, 'published'])->name('published.index');
        Route::get('/articles/{article}/review', [EditorController::class, 'show'])->name('articles.show');
        Route::post('/articles/{article}/claim', [EditorController::class, 'claim'])->name('articles.claim');
        Route::post('/articles/{article}/release', [EditorController::class, 'release'])->name('articles.release');
        Route::post('/articles/{article}/request-revision', [EditorController::class, 'requestRevision'])->middleware('permission:article.request-revision')->name('articles.requestRevision');
        Route::post('/articles/{article}/reject', [EditorController::class, 'reject'])->name('articles.reject');
        Route::post('/articles/{article}/publish', [EditorController::class, 'publish'])->middleware('permission:article.publish')->name('articles.publish');
        // Separate endpoint so editors can approve public listing after publication.
        Route::post('/articles/{article}/approve-public', [EditorController::class, 'approvePublic'])->middleware('permission:article.approve-public')->name('articles.approvePublic');
    });
