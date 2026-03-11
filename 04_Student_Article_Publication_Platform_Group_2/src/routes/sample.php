<?php

/**
 * This routes are intended for guide/reference only
 * showing some tech stack sample usages.
 */

use App\Http\Controllers\SampleController;
use Illuminate\Support\Facades\Route;

// Sample routes are for development/reference only. Restrict them
// to local/testing environments and require authentication so they
// are not publicly exposed in production.
// Allow sample routes only in local/testing AND when explicitly enabled
// via the ALLOW_SAMPLE_ROUTES environment variable (true/false).
if (app()->environment(['local', 'testing']) && filter_var(env('ALLOW_SAMPLE_ROUTES', false), FILTER_VALIDATE_BOOLEAN)) {
    // Auth-protected sample pages
    Route::middleware('auth')->prefix('sample')->group(function () {
        Route::get('/email', [SampleController::class, 'testEmail']);
        Route::get('/jodit-editor', [SampleController::class, 'testJoditEditor']);
    });

    // Lightweight demo helpers (no auth) for quickly switching demo accounts
    // register under the 'sample' prefix so UI links using /sample/* resolve
    Route::prefix('sample')->group(function () {
        Route::get('/switch/{role}', [SampleController::class, 'switch'])->where('role', 'writer|editor|student');
        Route::get('/logout', [SampleController::class, 'logout']);
    });
}

