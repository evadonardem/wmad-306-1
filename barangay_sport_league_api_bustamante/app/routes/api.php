<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\LeagueController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\StandingsController;
use App\Http\Controllers\TeamController;
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

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    Route::apiResource('leagues', LeagueController::class);

    Route::get('leagues/{league}/seasons', [SeasonController::class, 'index']);
    Route::post('leagues/{league}/seasons', [SeasonController::class, 'store']);
    Route::get('seasons/{season}', [SeasonController::class, 'show']);
    Route::put('seasons/{season}', [SeasonController::class, 'update']);
    Route::patch('seasons/{season}', [SeasonController::class, 'update']);

    Route::get('seasons/{season}/teams', [TeamController::class, 'index']);
    Route::post('seasons/{season}/teams', [TeamController::class, 'store']);
    Route::get('teams/{team}', [TeamController::class, 'show']);
    Route::put('teams/{team}', [TeamController::class, 'update']);
    Route::patch('teams/{team}', [TeamController::class, 'update']);
    Route::post('teams/{team}/players', [TeamController::class, 'addPlayer']);
    Route::delete('teams/{team}/players/{player}', [TeamController::class, 'removePlayer']);

    Route::apiResource('players', PlayerController::class);
    Route::get('players/{player}/profile', [PlayerController::class, 'profile']);

    Route::get('seasons/{season}/games', [GameController::class, 'index']);
    Route::post('seasons/{season}/games', [GameController::class, 'store']);
    Route::get('games/{game}', [GameController::class, 'show']);
    Route::post('games/{game}/result', [GameController::class, 'submitResult']);
    Route::post('games/{game}/stats', [GameController::class, 'submitStats']);

    Route::get('seasons/{season}/standings', [StandingsController::class, 'standings']);
    Route::get('seasons/{season}/leaderboard', [StandingsController::class, 'leaderboard']);
    Route::get('seasons/{season}/summary', [StandingsController::class, 'summary']);
});
