<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // if user is logged in go to dashboard; otherwise show login page
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

// dashboard now handled by controller so we can pass projects/tasks as props
use App\Http\Controllers\DashboardController;

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // projects resource (index, store, show, update, destroy)
    Route::resource('projects', \App\Http\Controllers\ProjectController::class)
        ->only(['index','store','show','update','destroy']);

    // tasks nested under projects for index/store, plus shallow routes
    Route::resource('projects.tasks', \App\Http\Controllers\TaskController::class)
        ->shallow()
        ->only(['index','store','update','destroy']);

    // toggle a task's status
    Route::post('/tasks/{task}/toggle-status', [\App\Http\Controllers\TaskController::class,'toggleStatus'])
        ->name('tasks.toggle-status');
});

require __DIR__.'/auth.php';
