<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WriterController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\StudentController;
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
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Writer routes
Route::middleware(['auth', 'role:writer'])->prefix('writer')->group(function () {
    Route::get('/dashboard', [WriterController::class, 'dashboard'])->name('writer.dashboard');
    Route::get('/articles/create', [WriterController::class, 'create'])->name('writer.create');
    Route::post('/articles', [WriterController::class, 'store'])->name('writer.store');
    Route::get('/articles/{article}/edit', [WriterController::class, 'edit'])->name('writer.edit');
    Route::patch('/articles/{article}', [WriterController::class, 'update'])->name('writer.update');
    Route::post('/articles/{article}/submit', [WriterController::class, 'submit'])->name('writer.submit');
    Route::delete('/articles/{article}', [WriterController::class, 'destroy'])->name('writer.destroy');
});

// Editor routes
Route::middleware(['auth', 'role:editor'])->prefix('editor')->group(function () {
    Route::get('/dashboard', [EditorController::class, 'dashboard'])->name('editor.dashboard');
    Route::get('/articles/{article}/review', [EditorController::class, 'review'])->name('editor.review');
    Route::post('/articles/{article}/request-revision', [EditorController::class, 'requestRevision'])->name('editor.request-revision');
    Route::post('/articles/{article}/publish', [EditorController::class, 'publish'])->name('editor.publish');
});

// Student routes
Route::middleware(['auth', 'role:student'])->prefix('student')->group(function () {
    Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('student.dashboard');
    Route::get('/articles/{article}', [StudentController::class, 'show'])->name('student.show');
    Route::post('/articles/{article}/comments', [StudentController::class, 'storeComment'])->name('student.store-comment');
    Route::delete('/comments/{comment}', [StudentController::class, 'deleteComment'])->name('student.delete-comment');
});

require __DIR__.'/auth.php';
require __DIR__.'/sample.php';
