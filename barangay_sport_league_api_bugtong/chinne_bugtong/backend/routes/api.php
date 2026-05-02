<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LeagueController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\StandingsController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('users', UserController::class)->only(['index', 'show']);
    Route::apiResource('leagues', LeagueController::class);
    Route::apiResource('players', PlayerController::class);
    Route::apiResource('teams', TeamController::class);
    Route::apiResource('games', GameController::class);
    Route::get('/leagues/{league}/seasons', [SeasonController::class, 'index']);
    Route::post('/leagues/{league}/seasons', [SeasonController::class, 'store']);
    Route::get('/seasons/{season}', [SeasonController::class, 'show']);
    Route::put('/seasons/{season}', [SeasonController::class, 'update']);
    Route::get('/seasons/{season}/teams', [TeamController::class, 'index']);
    Route::post('/seasons/{season}/teams', [TeamController::class, 'store']);
    Route::post('/teams/{team}/players', [TeamController::class, 'addPlayer']);
    Route::delete('/teams/{team}/players/{player}', [TeamController::class, 'removePlayer']);

    Route::get('/seasons/{season}/games', [GameController::class, 'index']);
    Route::post('/seasons/{season}/games', [GameController::class, 'store']);
    Route::post('/games/{game}/result', [GameController::class, 'submitResult']);
    Route::post('/games/{game}/stats', [GameController::class, 'submitStats']);

    Route::get('/seasons/{season}/standings', [StandingsController::class, 'standings']);
    Route::get('/seasons/{season}/leaderboard', [StandingsController::class, 'leaderboard']);
});
