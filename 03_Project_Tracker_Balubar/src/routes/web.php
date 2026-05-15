<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\HelpController;
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
    try {
        $user = auth()->user();

        // Check if tables exist by using try-catch
        $projects = [];
        $stats = [
            'total_projects' => 0,
            'total_tasks' => 0,
            'completed_tasks' => 0,
            'pending_tasks' => 0,
        ];

        if (\Schema::hasTable('projects')) {
            $projects = $user->projects()
                ->withCount('tasks')
                ->withCount(['tasks as completed_tasks_count' => function ($query) {
                    $query->where('status', 'completed');
                }])
                ->latest()
                ->take(5)
                ->get();

            $stats['total_projects'] = $user->projects()->count();

            if (\Schema::hasTable('tasks')) {
                $stats['total_tasks'] = $user->projects()->with('tasks')->get()->flatMap->tasks->count();
                $stats['completed_tasks'] = $user->projects()->with(['tasks' => function ($query) {
                    $query->where('status', 'completed');
                }])->get()->flatMap->tasks->count();
                $stats['pending_tasks'] = $user->projects()->with(['tasks' => function ($query) {
                    $query->where('status', 'pending');
                }])->get()->flatMap->tasks->count();
            }
        }

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user,
            ],
            'projects' => $projects,
            'stats' => $stats,
        ]);
    } catch (\Exception $e) {
        // If there's any error, return basic dashboard
        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'projects' => [],
            'stats' => [
                'total_projects' => 0,
                'total_tasks' => 0,
                'completed_tasks' => 0,
                'pending_tasks' => 0,
            ],
        ]);
    }
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Projects routes
    Route::resource('projects', ProjectController::class);

    // Tasks routes
    Route::resource('tasks', TaskController::class);

    // Settings route
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');

    // Help route
    Route::get('/help', [HelpController::class, 'index'])->name('help');
});

require __DIR__.'/auth.php';
