<?php

use Illuminate\Http\Request;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LeagueController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\StandingsController;
use App\Http\Controllers\SeasonSummaryController;
use App\Http\Controllers\PlayerProfileController;

Route::get('/', function () {
    $routes = collect(Route::getRoutes())
        ->filter(function (RoutingRoute $route) {
            // Only include routes that start with 'api/'
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

// Authentication Routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Protected Routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::post('logout', [AuthController::class, 'logout']);

    // League Routes
    Route::apiResource('leagues', LeagueController::class);

    // Season Routes (nested under leagues - using resource pattern)
    Route::apiResource('leagues.seasons', SeasonController::class);

    // Team Routes (nested under seasons)
    Route::get('seasons/{season}/teams', [TeamController::class, 'index']);
    Route::post('seasons/{season}/teams', [TeamController::class, 'store']);
    Route::get('teams/{team}', [TeamController::class, 'show']);
    Route::put('teams/{team}', [TeamController::class, 'update']);

    // Team Player Management
    Route::post('teams/{team}/players', [TeamController::class, 'addPlayer']);
    Route::delete('teams/{team}/players/{player}', [TeamController::class, 'removePlayer']);

    // Game Routes (nested under seasons)
    Route::get('seasons/{season}/games', [GameController::class, 'index']);
    Route::post('seasons/{season}/games', [GameController::class, 'store']);
    Route::get('games/{game}', [GameController::class, 'show']);

    // Game Result and Stats Submission
    Route::post('games/{game}/result', [GameController::class, 'submitResult']);
    Route::post('games/{game}/stats', [GameController::class, 'submitStats']);

    // Standings and Leaderboard Routes
    Route::get('seasons/{season}/standings', [StandingsController::class, 'standings']);
    Route::get('seasons/{season}/leaderboard', [StandingsController::class, 'playerLeaderboard']);

    // Exercise Routes
    Route::get('seasons/{season}/summary', [SeasonSummaryController::class, 'summary']);
    Route::get('players/{player}/profile', [PlayerProfileController::class, 'profile']);
});
