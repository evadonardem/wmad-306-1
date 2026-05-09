<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LeagueController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\GameController; // New import

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('leagues', LeagueController::class);

    // Season Routes
    Route::get('/leagues/{id}/seasons', [SeasonController::class, 'index']);
    Route::post('/leagues/{id}/seasons', [SeasonController::class, 'store']);
    Route::get('/seasons/{id}', [SeasonController::class, 'show']);
    Route::put('/seasons/{id}', [SeasonController::class, 'update']);

    // Team Routes
    Route::get('/seasons/{id}/teams', [TeamController::class, 'index']);
    Route::post('/seasons/{id}/teams', [TeamController::class, 'store']);
    Route::get('/teams/{id}', [TeamController::class, 'show']);
    Route::put('/teams/{id}', [TeamController::class, 'update']);

    // Game Routes
    Route::get('/seasons/{id}/games', [GameController::class, 'index']);
    Route::post('/seasons/{id}/games', [GameController::class, 'store']);
    Route::get('/games/{id}', [GameController::class, 'show']);

    // Pivot Routes (Adding/Removing players from teams)
    Route::post('/teams/{id}/players', [TeamController::class, 'addPlayer']);
    Route::delete('/teams/{id}/players/{playerId}', [TeamController::class, 'removePlayer']);

    // Player Route
    Route::post('/players', [PlayerController::class, 'store']);
    // Game Routes
    Route::get('/seasons/{id}/games', [GameController::class, 'index']);
    Route::post('/seasons/{id}/games', [GameController::class, 'store']);
    Route::get('/games/{id}', [GameController::class, 'show']);

    // Task 8 Routes
    Route::post('/games/{id}/result', [GameController::class, 'submitResult']);
    Route::post('/games/{id}/stats', [GameController::class, 'submitStats']);
    // Season Routes
    Route::get('/leagues/{id}/seasons', [SeasonController::class, 'index']);
    Route::post('/leagues/{id}/seasons', [SeasonController::class, 'store']);
    Route::get('/seasons/{id}', [SeasonController::class, 'show']);
    Route::put('/seasons/{id}', [SeasonController::class, 'update']);

    // Task 9 Route
    Route::get('/seasons/{id}/standings', [SeasonController::class, 'standings']);
    // Task 9 & 10 Routes
    Route::get('/seasons/{id}/standings', [SeasonController::class, 'standings']);
    Route::get('/seasons/{id}/leaderboard', [SeasonController::class, 'leaderboard']); // NEW!
});
