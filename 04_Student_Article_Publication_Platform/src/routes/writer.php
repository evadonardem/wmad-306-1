<?php

use App\Http\Controllers\Writer\WriterController;
use App\Http\Controllers\Writer\WriterDashboardController;
use Illuminate\Support\Facades\Route;

// Register writer-only drafting and submission routes.
Route::middleware(['auth', 'verified', 'role:writer'])
    ->prefix('writer')
    ->as('writer.')
    ->group(function (): void {
        Route::get('/dashboard', [WriterDashboardController::class, 'index'])->name('dashboard');
        Route::post('/articles', [WriterController::class, 'store'])->middleware('permission:article.create')->name('articles.store');
        Route::post('/articles/{article}/submit', [WriterController::class, 'submit'])->middleware('permission:article.submit')->name('articles.submit');
        Route::post('/articles/{article}/revise', [WriterController::class, 'revise'])->middleware('permission:article.revise')->name('articles.revise');
    });
