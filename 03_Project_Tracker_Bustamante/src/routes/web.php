<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Models\Task;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home route: renders Welcome page with environment flags
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Authenticated dashboard: only for verified users
Route::get('/dashboard', function () {
    $user = auth()->user();

    $projectsCount = $user->projects()->count();
    $tasksCount = Task::query()
        ->whereHas('project', fn ($q) => $q->where('user_id', $user->id))
        ->count();

    $tasksDoneCount = Task::query()
        ->where('status', 'done')
        ->whereHas('project', fn ($q) => $q->where('user_id', $user->id))
        ->count();

    return Inertia::render('Dashboard', [
        'stats' => [
            'projects' => $projectsCount,
            'tasks' => $tasksCount,
            'done' => $tasksDoneCount,
        ],
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// Profile management routes, require auth
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('projects', ProjectController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('projects.tasks', TaskController::class)->only(['index', 'store']);
    Route::resource('tasks', TaskController::class)->only(['update', 'destroy']);
    Route::patch('/tasks/{task}/toggle-status', [TaskController::class, 'toggleStatus'])->name('tasks.toggle-status');
});

require __DIR__.'/auth.php';
