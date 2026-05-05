<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LeagueController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\StandingsController;
use App\Http\Controllers\PlayerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public authentication routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Protected routes requiring Sanctum authentication
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('logout', [AuthController::class, 'logout']);

    // Leagues
    Route::get('leagues', [LeagueController::class, 'index']);
    Route::post('leagues', [LeagueController::class, 'store']);
    Route::get('leagues/{league}', [LeagueController::class, 'show']);
    Route::put('leagues/{league}', [LeagueController::class, 'update']);
    Route::delete('leagues/{league}', [LeagueController::class, 'destroy']);

    // Seasons
    Route::get('leagues/{league}/seasons', [SeasonController::class, 'index']);
    Route::post('leagues/{league}/seasons', [SeasonController::class, 'store']);
    Route::get('seasons/{season}', [SeasonController::class, 'show']);
    Route::put('seasons/{season}', [SeasonController::class, 'update']);

    // Teams
    Route::get('seasons/{season}/teams', [TeamController::class, 'index']);
    Route::post('seasons/{season}/teams', [TeamController::class, 'store']);
    Route::get('teams/{team}', [TeamController::class, 'show']);
    Route::put('teams/{team}', [TeamController::class, 'update']);
    Route::post('teams/{team}/players', [TeamController::class, 'addPlayer']);
    Route::delete('teams/{team}/players/{player}', [TeamController::class, 'removePlayer']);

    // Games
    Route::get('seasons/{season}/games', [GameController::class, 'index']);
    Route::post('seasons/{season}/games', [GameController::class, 'store']);
    Route::get('games/{game}', [GameController::class, 'show']);
    Route::post('games/{game}/result', [GameController::class, 'submitResult']);
    Route::post('games/{game}/stats', [GameController::class, 'submitStats']);

    // Standings and Leaderboard
    Route::get('seasons/{season}/standings', [StandingsController::class, 'standings']);
    Route::get('seasons/{season}/leaderboard', [StandingsController::class, 'leaderboard']);
    Route::get('seasons/{season}/summary', [StandingsController::class, 'summary']);

    // Players
    Route::get('players/{player}/profile', [PlayerController::class, 'profile']);
});

