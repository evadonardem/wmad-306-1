<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
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
    $user = auth()->user();
    
    $projects = $user->projects()->with('tasks')->get();
    
    $stats = [
        'totalProjects' => $projects->count(),
        'completedProjects' => $projects->where('status', 'completed')->count(),
        'pendingProjects' => $projects->where('status', 'pending')->count(),
        'totalTasks' => $projects->flatMap(function ($project) {
            return $project->tasks;
        })->count(),
        'completedTasks' => $projects->flatMap(function ($project) {
            return $project->tasks;
        })->where('status', 'completed')->count(),
        'pendingTasks' => $projects->flatMap(function ($project) {
            return $project->tasks;
        })->where('status', 'pending')->count(),
    ];
    
    return Inertia::render('Dashboard', ['stats' => $stats]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Project routes
    Route::resource('projects', ProjectController::class);
    Route::post('projects/{project}/tasks', [ProjectController::class, 'storeTask'])->name('projects.tasks.store');
    Route::patch('tasks/{task}', [ProjectController::class, 'updateTask'])->name('tasks.update');
    Route::delete('tasks/{task}', [ProjectController::class, 'destroyTask'])->name('tasks.destroy');
    Route::patch('tasks/{task}/toggle', [ProjectController::class, 'toggleTask'])->name('tasks.toggle');
});

require __DIR__.'/auth.php';
