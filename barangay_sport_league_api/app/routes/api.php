<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\LeagueController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\PlayerProfileController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\SeasonSummaryController;
use App\Http\Controllers\StandingsController;
use App\Http\Controllers\TeamController;
use Illuminate\Http\Request;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $routes = collect(Route::getRoutes())
        ->filter(function (RoutingRoute $route) {
            return str_starts_with($route->uri(), 'api');
        })
        ->map(function (RoutingRoute $route) {
            return [
                'method' => implode('|', $route->methods()),
                'uri'    => $route->uri(),
                'action' => $route->getActionName(),
            ];
        });

    return response()->json([
        'api' => config('app.name') . ' API',
        'total_api_routes' => $routes->count(),
        'routes' => $routes,
    ]);
});

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Leagues - CRUD
    Route::get('/leagues', [LeagueController::class, 'index']);
    Route::post('/leagues', [LeagueController::class, 'store']);
    Route::get('/leagues/{league}', [LeagueController::class, 'show']);
    Route::put('/leagues/{league}', [LeagueController::class, 'update']);
    Route::delete('/leagues/{league}', [LeagueController::class, 'destroy']);

    // Seasons - nested under leagues
    Route::get('/leagues/{league}/seasons', [SeasonController::class, 'index']);
    Route::post('/leagues/{league}/seasons', [SeasonController::class, 'store']);
    Route::get('/seasons/{season}', [SeasonController::class, 'show']);
    Route::put('/seasons/{season}', [SeasonController::class, 'update']);
    Route::delete('/seasons/{season}', [SeasonController::class, 'destroy']);

    // Season Summary
    Route::get('/seasons/{season}/summary', [SeasonSummaryController::class, 'summary']);

    // Teams - nested under seasons
    Route::get('/seasons/{season}/teams', [TeamController::class, 'index']);
    Route::post('/seasons/{season}/teams', [TeamController::class, 'store']);
    Route::get('/teams/{team}', [TeamController::class, 'show']);
    Route::put('/teams/{team}', [TeamController::class, 'update']);
    Route::delete('/teams/{team}', [TeamController::class, 'destroy']);

    // Players on Teams
    Route::post('/teams/{team}/players', [TeamController::class, 'addPlayer']);
    Route::delete('/teams/{team}/players/{player}', [TeamController::class, 'removePlayer']);

    // Games - nested under seasons
    Route::get('/seasons/{season}/games', [GameController::class, 'index']);
    Route::post('/seasons/{season}/games', [GameController::class, 'store']);
    Route::get('/games/{game}', [GameController::class, 'show']);
    Route::put('/games/{game}', [GameController::class, 'update']);
    Route::delete('/games/{game}', [GameController::class, 'destroy']);

    // Game Results
    Route::post('/games/{game}/result', [GameController::class, 'recordResult']);
    Route::get('/games/{game}/result', [GameController::class, 'getResult']);

    // Players
    Route::get('/players', [PlayerController::class, 'index']);
    Route::post('/players', [PlayerController::class, 'store']);
    Route::get('/players/{player}', [PlayerController::class, 'show']);
    Route::put('/players/{player}', [PlayerController::class, 'update']);
    Route::delete('/players/{player}', [PlayerController::class, 'destroy']);

    // Player Profile
    Route::get('/players/{player}/profile', [PlayerProfileController::class, 'profile']);

    // Standings
    Route::get('/seasons/{season}/standings', [StandingsController::class, 'standings']);
    Route::get('/seasons/{season}/top-scorers', [StandingsController::class, 'topScorers']);
});