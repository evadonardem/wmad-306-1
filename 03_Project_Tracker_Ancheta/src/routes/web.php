<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Project routes
    Route::resource('projects', \App\Http\Controllers\ProjectController::class);

    // Nested task routes under projects - tasks only exist within project context
    Route::resource('projects.tasks', \App\Http\Controllers\TaskController::class)
        ->except(['create', 'edit']);

    // Task status toggle route
    Route::post('/projects/{project}/tasks/{task}/toggle-status', [\App\Http\Controllers\TaskController::class, 'toggleStatus'])
        ->name('projects.tasks.toggle-status');

    // Direct task status update route
    Route::post('/projects/{project}/tasks/{task}/update-status', [\App\Http\Controllers\TaskController::class, 'updateStatus'])
        ->name('projects.tasks.update-status');
});

require __DIR__.'/auth.php';

