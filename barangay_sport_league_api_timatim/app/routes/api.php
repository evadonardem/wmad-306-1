<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\LeagueController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\PlayerProfileController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\StandingsController;
use App\Http\Controllers\TeamController;
use Illuminate\Http\Request;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Facades\Route;

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

// Public authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // League routes
    Route::apiResource('leagues', LeagueController::class);
    
    // Season routes (nested under leagues)
    Route::get('/leagues/{league}/seasons', [SeasonController::class, 'index']);
    Route::post('/leagues/{league}/seasons', [SeasonController::class, 'store']);
    Route::post('/seasons', [SeasonController::class, 'storeDirect']);
    Route::get('/seasons/{season}', [SeasonController::class, 'show']);
    Route::put('/seasons/{season}', [SeasonController::class, 'update']);
    Route::delete('/seasons/{season}', [SeasonController::class, 'destroy']);
    
    // Team routes
    Route::get('/seasons/{season}/teams', [TeamController::class, 'index']);
    Route::post('/seasons/{season}/teams', [TeamController::class, 'store']);
    Route::get('/teams/{team}', [TeamController::class, 'show']);
    Route::put('/teams/{team}', [TeamController::class, 'update']);
    Route::post('/teams/{team}/players', [TeamController::class, 'addPlayer']);
    Route::delete('/teams/{team}/players/{player}', [TeamController::class, 'removePlayer']);
    
    // Game routes
    Route::get('/seasons/{season}/games', [GameController::class, 'index']);
    Route::post('/seasons/{season}/games', [GameController::class, 'store']);
    Route::post('/games', [GameController::class, 'storeDirect']);
    Route::get('/games/{game}', [GameController::class, 'show']);
    Route::put('/games/{game}', [GameController::class, 'update']);
    Route::delete('/games/{game}', [GameController::class, 'destroy']);
    Route::post('/games/{game}/result', [GameController::class, 'submitResult']);
    Route::post('/games/{game}/stats', [GameController::class, 'submitStats']);
    
    // Standings route
    Route::get('/seasons/{season}/standings', [StandingsController::class, 'seasonStandings']);
    Route::get('/seasons/{season}/leaderboard', [StandingsController::class, 'playerLeaderboard']);
    Route::get('/seasons/{season}/summary', [StandingsController::class, 'seasonSummary']);
    
    // Player profile route
    Route::get('/players', [PlayerController::class, 'index']);
    Route::post('/players', [PlayerController::class, 'store']);
    Route::get('/players/{player}', [PlayerController::class, 'show']);
    Route::get('/players/{player}/profile', [PlayerProfileController::class, 'profile']);
});
