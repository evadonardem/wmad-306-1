<?php

use App\Http\Controllers\Student\StudentController;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Student\WriterApplicationController;
use Illuminate\Support\Facades\Route;

// Register student-only dashboard and commenting routes.
Route::middleware(['auth', 'verified', 'role:student'])
    ->prefix('student')
    ->as('student.')
    ->group(function (): void {
        Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
        Route::get('/articles', [StudentController::class, 'studentDashboard'])->name('articles.index');
        Route::get('/profile', [StudentController::class, 'profile'])->name('profile');
        // Settings routes
        Route::get('/settings', [\App\Http\Controllers\Student\SettingsController::class, 'index'])->name('settings');
        Route::get('/settings/appearance', [\App\Http\Controllers\Student\SettingsController::class, 'appearance'])->name('settings.appearance');
        Route::put('/settings', [\App\Http\Controllers\Student\SettingsController::class, 'update'])->name('settings.update');
        Route::put('/settings/password', [\App\Http\Controllers\Student\SettingsController::class, 'updatePassword'])->name('settings.password.update');
        Route::delete('/settings', [\App\Http\Controllers\Student\SettingsController::class, 'destroy'])->name('settings.destroy');
        Route::get('/writer-application', [WriterApplicationController::class, 'create'])->name('writer-application.create');
        Route::post('/writer-application', [WriterApplicationController::class, 'store'])->name('writer-application.store');
        Route::post('/articles/{article}/comments', [StudentController::class, 'comment'])->middleware('permission:comment.create')->name('articles.comment');
        Route::post('/articles/{article}/views', [StudentController::class, 'recordView'])->name('articles.view');
        Route::post('/articles/{article}/stars/toggle', [StudentController::class, 'toggleStar'])->name('articles.star.toggle');
        Route::post('/articles/{article}/saves/toggle', [StudentController::class, 'toggleSave'])->name('articles.save.toggle');
        Route::post('/profile/avatar', [StudentController::class, 'updateAvatar'])->name('profile.avatar.update');
    });
