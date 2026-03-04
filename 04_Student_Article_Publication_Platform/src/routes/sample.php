<?php

/**
 * This routes are intended for guide/reference only
 * showing some tech stack sample usages.
 */

use App\Http\Controllers\SampleController;
use Illuminate\Support\Facades\Route;

// Register sample endpoints used for stack demonstrations.
Route::prefix('sample')->group(function () {
    Route::get('/email', [SampleController::class, 'testEmail']);
    Route::get('/jodit-editor', [SampleController::class, 'testJoditEditor']);
});

