<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WriterController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/dashboard', function () {
    /** @var \App\Models\User $user */
    $user = Auth::user();
    if ($user->hasRole('writer')) {
        return redirect()->route('writer.dashboard');
    }
    if ($user->hasRole('editor')) {
        return redirect()->route('editor.dashboard');
    }
    if ($user->hasRole('student')) {
        return redirect()->route('student.dashboard');
    }
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Route Table
|--------------------------------------------------------------------------
| Method  | URI                                       | Name                  | Role
|---------|-------------------------------------------|-----------------------|--------
| GET     | /writer/dashboard                         | writer.dashboard      | writer
| GET     | /writer/articles/create                   | articles.create       | writer
| POST    | /writer/articles                          | articles.store        | writer
| GET     | /writer/articles/{article}/edit           | articles.edit         | writer
| PATCH   | /writer/articles/{article}                | articles.update       | writer
| POST    | /writer/articles/{article}/submit         | articles.submit       | writer
| DELETE  | /writer/articles/{article}                | articles.destroy      | writer
| GET     | /editor/dashboard                         | editor.dashboard      | editor
| GET     | /editor/articles/{article}/review         | editor.review         | editor
| POST    | /editor/articles/{article}/revision       | articles.revision     | editor
| POST    | /editor/articles/{article}/publish        | articles.publish      | editor
| GET     | /student/dashboard                        | student.dashboard     | student
| GET     | /student/articles/{article}               | student.show          | student
| POST    | /student/articles/{article}/comment       | articles.comment      | student
| DELETE  | /student/comments/{comment}               | student.delete-comment| student
| GET     | /login                                    | login                 | guest
| POST    | /login                                    | (login POST)          | guest
| GET     | /register                                 | register              | guest
| POST    | /register                                 | (register POST)       | guest
|--------------------------------------------------------------------------
*/

// Writer routes
Route::middleware(['auth', 'role:writer'])->prefix('writer')->group(function () {
    Route::get('/dashboard', [WriterController::class, 'dashboard'])->name('writer.dashboard');
    Route::get('/articles/create', [WriterController::class, 'create'])->name('articles.create');
    Route::post('/articles', [WriterController::class, 'store'])->name('articles.store');
    Route::get('/articles/{article}/edit', [WriterController::class, 'edit'])->name('articles.edit');
    Route::patch('/articles/{article}', [WriterController::class, 'update'])->name('articles.update');
    Route::post('/articles/{article}/submit', [WriterController::class, 'submit'])->name('articles.submit');
    Route::delete('/articles/{article}', [WriterController::class, 'destroy'])->name('articles.destroy');
});

// Editor routes
Route::middleware(['auth', 'role:editor'])->prefix('editor')->group(function () {
    Route::get('/dashboard', [EditorController::class, 'dashboard'])->name('editor.dashboard');
    Route::get('/articles/{article}/review', [EditorController::class, 'review'])->name('editor.review');
    Route::post('/articles/{article}/revision', [EditorController::class, 'requestRevision'])->name('articles.revision');
    Route::post('/articles/{article}/publish', [EditorController::class, 'publish'])->name('articles.publish');
    Route::patch('/articles/{article}/content', [EditorController::class, 'updateContent'])->name('editor.updateContent');
});

// Student routes
Route::middleware(['auth', 'role:student'])->prefix('student')->group(function () {
    Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('student.dashboard');
    Route::get('/articles/{article}', [StudentController::class, 'show'])->name('student.show');
    Route::post('/articles/{article}/comment', [StudentController::class, 'storeComment'])->name('articles.comment');
    Route::delete('/comments/{comment}', [StudentController::class, 'deleteComment'])->name('student.delete-comment');
});

require __DIR__.'/auth.php';
require __DIR__.'/sample.php';
