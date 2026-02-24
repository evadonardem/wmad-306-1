<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/projects', [ProjectController::class, 'apiIndex']);
});
