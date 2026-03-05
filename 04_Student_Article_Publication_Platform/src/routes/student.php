<?php

use App\Http\Controllers\Student\StudentController;
use App\Http\Controllers\Student\StudentDashboardController;
use Illuminate\Support\Facades\Route;

// Register student-only dashboard and commenting routes.
Route::middleware(['auth', 'verified', 'role:student'])
    ->prefix('student')
    ->as('student.')
    ->group(function (): void {
        Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
        Route::get('/articles', [StudentController::class, 'studentDashboard'])->name('articles.index');
        Route::get('/profile', [StudentController::class, 'profile'])->name('profile');
        Route::get('/settings', [StudentController::class, 'settings'])->name('settings');
        Route::put('/settings', [StudentController::class, 'updateSettings'])->name('settings.update');
        Route::post('/articles/{article}/comments', [StudentController::class, 'comment'])->middleware('permission:comment.create')->name('articles.comment');
        Route::post('/articles/{article}/views', [StudentController::class, 'recordView'])->name('articles.view');
        Route::post('/articles/{article}/stars/toggle', [StudentController::class, 'toggleStar'])->name('articles.star.toggle');
        Route::post('/articles/{article}/saves/toggle', [StudentController::class, 'toggleSave'])->name('articles.save.toggle');
    });
