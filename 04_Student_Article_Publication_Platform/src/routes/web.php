<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WriterController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Root redirect
Route::get('/', function () {
    return redirect()->route('login');
});

// Role-Based Dashboard Redirect
Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user->hasRole('admin')) return redirect()->route('articles.admin');
    if ($user->hasRole('writer')) return redirect()->route('writer.dashboard');
    if ($user->hasRole('editor')) return redirect()->route('editor.dashboard');
    if ($user->hasRole('student')) return redirect()->route('student.dashboard');
    return abort(403, 'Unauthorized action. No role assigned.');
})->middleware(['auth', 'verified'])->name('dashboard');

// Profile Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Management (Phase 6)
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('articles.admin');
    Route::post('/admin/users/{user}/role', [AdminController::class, 'updateRole'])->name('admin.users.update-role');
});

// Writer Article Lifecycle
Route::middleware(['auth', 'role:writer'])->group(function () {
    Route::get('/writer/dashboard', [WriterController::class, 'dashboard'])->name('writer.dashboard');
    Route::post('/articles', [WriterController::class, 'store'])->name('articles.store');
    Route::post('/articles/{article}/submit', [WriterController::class, 'submit'])->name('articles.submit');
    Route::put('/articles/{article}/revise', [WriterController::class, 'revise'])->name('articles.revise');
    Route::post('/articles/{article}/unsubmit', [WriterController::class, 'unsubmit'])->name('articles.unsubmit');
    Route::delete('/articles/{article}', [WriterController::class, 'destroy'])->name('articles.destroy');
});

// Editor Review Lifecycle
Route::middleware(['auth', 'role:editor'])->group(function () {
    Route::get('/editor/dashboard', [EditorController::class, 'dashboard'])->name('editor.dashboard');
    Route::post('/articles/{article}/revision', [EditorController::class, 'requestRevision'])->name('articles.revision');
    Route::post('/articles/{article}/publish', [EditorController::class, 'publish'])->name('articles.publish');
});

// ==========================================
// Student Routes
// ==========================================
Route::middleware(['auth', 'role:student'])->group(function () {
    Route::get('/student/dashboard', [StudentController::class, 'studentDashboard'])->name('student.dashboard');
    Route::post('/articles/{article}/comment', [StudentController::class, 'comment'])->name('articles.comment');
    // NEW: Route to allow students to delete their own comments
    Route::delete('/comments/{comment}', [StudentController::class, 'deleteComment'])->name('comments.destroy');
});

require __DIR__.'/auth.php';
