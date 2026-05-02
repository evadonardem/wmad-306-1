<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\LeagueController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\StandingsController;
use App\Http\Controllers\TeamController;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Facades\Route;

// API index - lists all routes
Route::get('/', function () {
    $routes = collect(Route::getRoutes())
        ->filter(fn(RoutingRoute $route) => str_starts_with($route->uri(), 'api'))
        ->map(fn(RoutingRoute $route) => [
            'method' => implode('|', $route->methods()),
            'uri'    => $route->uri(),
            'action' => $route->getActionName(),
        ]);

    return response()->json([
        'api'              => config('app.name') . ' API',
        'total_api_routes' => $routes->count(),
        'routes'           => $routes,
    ]);
});

// Public routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login',    [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    Route::post('logout', [AuthController::class, 'logout']);

    // Leagues
    Route::apiResource('leagues', LeagueController::class);

    // Seasons (nested under leagues + standalone)
    Route::get('leagues/{league}/seasons',  [SeasonController::class, 'index']);
    Route::post('leagues/{league}/seasons', [SeasonController::class, 'store']);
    Route::get('seasons/{season}',          [SeasonController::class, 'show']);
    Route::put('seasons/{season}',          [SeasonController::class, 'update']);

    // Teams (nested under seasons + standalone)
    Route::get('seasons/{season}/teams',    [TeamController::class, 'index']);
    Route::post('seasons/{season}/teams',   [TeamController::class, 'store']);
    Route::get('teams/{team}',              [TeamController::class, 'show']);
    Route::put('teams/{team}',              [TeamController::class, 'update']);

    // Players (standalone CRUD)
    Route::get('players',                   [TeamController::class, 'indexPlayer']);
    Route::post('players',                  [TeamController::class, 'storePlayer']);
    Route::get('players/{player}/profile',  [TeamController::class, 'playerProfile']);

    // Players on a team (pivot)
    Route::post('teams/{team}/players',            [TeamController::class, 'addPlayer']);
    Route::delete('teams/{team}/players/{player}', [TeamController::class, 'removePlayer']);

    // Games (nested under seasons + standalone)
    Route::get('seasons/{season}/games',    [GameController::class, 'index']);
    Route::post('seasons/{season}/games',   [GameController::class, 'store']);
    Route::get('games/{game}',              [GameController::class, 'show']);
    Route::post('games/{game}/result',      [GameController::class, 'submitResult']);
    Route::post('games/{game}/stats',       [GameController::class, 'submitStats']);

    // Standings, Leaderboard & Summary
    Route::get('seasons/{season}/standings',   [StandingsController::class, 'standings']);
    Route::get('seasons/{season}/leaderboard', [StandingsController::class, 'leaderboard']);
    Route::get('seasons/{season}/summary',     [StandingsController::class, 'summary']);
});