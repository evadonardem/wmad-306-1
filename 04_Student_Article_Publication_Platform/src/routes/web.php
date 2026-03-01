<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WriterController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Send users straight to login when they hit the home page
Route::get('/', function () {
    return redirect()->route('login');
});

// Smart Dashboard Redirect: Sends users to their specific role dashboard after login
Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user->hasRole('writer')) return redirect()->route('writer.dashboard');
    if ($user->hasRole('editor')) return redirect()->route('editor.dashboard');
    if ($user->hasRole('student')) return redirect()->route('student.dashboard');
    return abort(403, 'Unauthorized action.');
})->middleware(['auth', 'verified'])->name('dashboard');

// Default Profile Routes (Breeze)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ==========================================
// Phase 5 Rubric: Writer Routes
// ==========================================
Route::middleware(['auth', 'role:writer'])->group(function () {
    Route::get('/writer/dashboard', [WriterController::class, 'dashboard'])->name('writer.dashboard');
    Route::post('/articles', [WriterController::class, 'store'])->name('articles.store'); // Create draft
    Route::post('/articles/{article}/submit', [WriterController::class, 'submit'])->name('articles.submit');
    Route::put('/articles/{article}/revise', [WriterController::class, 'revise'])->name('articles.revise');
});

// ==========================================
// Phase 5 Rubric: Editor Routes
// ==========================================
Route::middleware(['auth', 'role:editor'])->group(function () {
    Route::get('/editor/dashboard', [EditorController::class, 'dashboard'])->name('editor.dashboard');
    Route::post('/articles/{article}/revision', [EditorController::class, 'requestRevision'])->name('articles.revision');
    Route::post('/articles/{article}/publish', [EditorController::class, 'publish'])->name('articles.publish');
});

// ==========================================
// Phase 5 Rubric: Student Routes
// ==========================================
Route::middleware(['auth', 'role:student'])->group(function () {
    Route::get('/student/dashboard', [StudentController::class, 'studentDashboard'])->name('student.dashboard');
    Route::post('/articles/{article}/comment', [StudentController::class, 'comment'])->name('articles.comment');
});

require __DIR__.'/auth.php';
