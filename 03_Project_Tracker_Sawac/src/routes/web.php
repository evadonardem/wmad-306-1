<?php

use App\Http\Controllers\ProfileController;
use App\Models\User;
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

Route::get('/dashboard', function () {
    /** @var User $user */
    $user = auth()->user();
    $recentProjects = $user->projects()->latest()->take(3)->get();
    $recentTasks = \App\Models\Task::whereHas('project', function ($q) use ($user) {
        $q->where('user_id', $user->id);
    })->latest()->take(5)->get();

    return Inertia::render('Dashboard', [
        'recentProjects' => $recentProjects,
        'recentTasks' => $recentTasks,
        'projectCount' => $user->projects()->count(),
        'taskCount' => \App\Models\Task::whereHas('project', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->count(),
        'completedTaskCount' => \App\Models\Task::whereHas('project', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->where('status', 'done')->count(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // Project & Task routes
    Route::resource('projects', App\Http\Controllers\ProjectController::class)->only(['index','store','update','destroy']);
    Route::resource('tasks', App\Http\Controllers\TaskController::class)->only(['index','store','update','destroy']);
    Route::post('tasks/{task}/toggle-status', [App\Http\Controllers\TaskController::class, 'toggleStatus'])->name('tasks.toggle-status');
});

require __DIR__.'/auth.php';
