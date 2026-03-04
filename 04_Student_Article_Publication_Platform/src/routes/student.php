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
        Route::post('/articles/{article}/comments', [StudentController::class, 'comment'])->middleware('permission:comment.create')->name('articles.comment');
    });
