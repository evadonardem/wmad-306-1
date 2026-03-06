<?php

use App\Http\Controllers\Writer\WriterController;
use App\Http\Controllers\Writer\WriterDashboardController;
use App\Http\Controllers\Writer\WriterArticleController;
use App\Http\Controllers\Writer\WriterDraftVersionController;
use App\Http\Controllers\Writer\WriterAnalysisController;
use Illuminate\Support\Facades\Route;

// Register writer-only drafting and submission routes.
Route::middleware(['auth', 'verified', 'role:writer'])
    ->prefix('writer')
    ->as('writer.')
    ->group(function (): void {
        Route::get('/dashboard', [WriterDashboardController::class, 'index'])->name('dashboard');

        // Writer pages
        Route::get('/articles/create', [WriterArticleController::class, 'create'])->name('articles.create');
        Route::get('/articles/{article}/edit', [WriterArticleController::class, 'edit'])->name('articles.edit');

        // Writer actions
        Route::post('/articles', [WriterController::class, 'store'])->middleware('permission:article.create')->name('articles.store');
        Route::patch('/articles/{article}', [WriterArticleController::class, 'update'])->name('articles.update');
        Route::post('/articles/{article}/submit', [WriterController::class, 'submit'])->middleware('permission:article.submit')->name('articles.submit');
        Route::post('/articles/{article}/revise', [WriterController::class, 'revise'])->middleware('permission:article.revise')->name('articles.revise');

        // Draft versions (autosave history)
        Route::get('/articles/{article}/draft-versions', [WriterDraftVersionController::class, 'index'])->name('articles.draftVersions.index');
        Route::post('/articles/{article}/draft-versions', [WriterDraftVersionController::class, 'store'])->name('articles.draftVersions.store');

        // Content analysis (writer tools)
        Route::post('/analysis/category-suggestions', [WriterAnalysisController::class, 'categorySuggestions'])->name('analysis.categorySuggestions');
        Route::post('/analysis/plagiarism', [WriterAnalysisController::class, 'plagiarism'])->name('analysis.plagiarism');
    });
