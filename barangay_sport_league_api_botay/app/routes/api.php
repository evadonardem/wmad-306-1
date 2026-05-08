<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LeagueController;
use App\Http\Controllers\Api\SeasonController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\PlayerController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\GameResultController;
use App\Http\Controllers\Api\StandingsController;
use App\Http\Controllers\Api\LeaderboardController;
use Illuminate\Support\Facades\Route;

// API routes documentation
Route::get('/', function () {
    return response()->json([
        'api' => 'Barangay Sports League API',
        'version' => '1.0',
        'description' => 'Complete REST API for managing community basketball leagues',
    ]);
});

// Authentication routes (public)
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // User
    Route::get('user', [AuthController::class, 'user']);
    Route::post('logout', [AuthController::class, 'logout']);

    // Leagues
    Route::apiResource('leagues', LeagueController::class);

    // Seasons (nested under leagues)
    Route::apiResource('leagues.seasons', SeasonController::class);
    
    // Add team to season
    Route::post('leagues/{league}/seasons/{season}/add-team', [SeasonController::class, 'addTeam']);

    // Teams
    Route::apiResource('teams', TeamController::class);

    // Players (nested under teams)
    Route::apiResource('teams.players', PlayerController::class);

    // Games (nested under seasons)
    Route::apiResource('seasons.games', GameController::class);

    // Game Results
    Route::post('seasons/{season}/games/{game}/result', [GameResultController::class, 'store']);
    Route::get('seasons/{season}/games/{game}/result', [GameResultController::class, 'show']);

    // Standings
    Route::get('seasons/{season}/standings', [StandingsController::class, 'index']);

    // Leaderboards
    Route::get('seasons/{season}/leaderboard', [LeaderboardController::class, 'season']);
    Route::get('teams/{team}/leaderboard', [LeaderboardController::class, 'team']);
});
