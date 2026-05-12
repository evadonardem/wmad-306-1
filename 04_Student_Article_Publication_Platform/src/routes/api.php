<?php

use App\Http\Controllers\ArticleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Article API routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('articles', ArticleController::class)->except(['create', 'edit']);
    Route::get('articles/search/{query}', [ArticleController::class, 'search']);
});