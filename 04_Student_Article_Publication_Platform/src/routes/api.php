<?php

use Illuminate\Support\Facades\Route;

// Register authenticated API endpoints.
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/user/preferences', [App\Http\Controllers\UserPreferenceController::class, 'update']);
    Route::get('/user/preferences', [App\Http\Controllers\UserPreferenceController::class, 'show']);
    // API endpoints for Student Article Publication Platform can be added here.
});
