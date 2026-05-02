<?php

use Illuminate\Http\Request;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\TeamController;

Route::get('/', function () {
    $routes = collect(Route::getRoutes())
        ->filter(fn (RoutingRoute $route) => str_starts_with($route->uri(), 'api'))
        ->map(fn (RoutingRoute $route) => [
            'method' => implode('|', $route->methods()),
            'uri'    => $route->uri(),
            'action' => $route->getActionName(),
        ]);

    return response()->json([
        'api' => config('app.name') . ' API',
        'total_api_routes' => $routes->count(),
        'routes' => $routes,
    ]);
});


// 🔥 AUTH ROUTES
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);


// 🔒 PROTECTED ROUTES (require Sanctum token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', function (Request $request) {
        return $request->user();
    });

    Route::post('logout', function (Request $request) {

        $user = $request->user();

        if (!$user || !$user->currentAccessToken()) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    });

    // 🔥 IMPORTANT: your leagues route
    Route::apiResource('leagues', \App\Http\Controllers\LeagueController::class);

    Route::prefix('leagues/{leagueId}')->group(function () {
        Route::get('seasons', [SeasonController::class, 'index']);
        Route::post('seasons', [SeasonController::class, 'store']);
        Route::get('seasons/{seasonId}', [SeasonController::class, 'show']);
        Route::put('seasons/{seasonId}', [SeasonController::class, 'update']);
        Route::delete('seasons/{seasonId}', [SeasonController::class, 'destroy']);
    });

    Route::get('seasons/{id}/teams', [TeamController::class, 'index']);
    Route::post('seasons/{id}/teams', [TeamController::class, 'store']);

    Route::get('teams/{id}', [TeamController::class, 'show']);
    Route::put('teams/{id}', [TeamController::class, 'update']);

    Route::post('teams/{id}/players', [TeamController::class, 'addPlayer']);
    Route::delete('teams/{id}/players/{playerId}', [TeamController::class, 'removePlayer']);

    Route::post('players', function (\Illuminate\Http\Request $request) {
        return \App\Models\Player::create($request->all());
    });

    Route::get('players/{id}/profile', [PlayerController::class, 'profile']);

    Route::get('seasons/{id}/games', [GameController::class, 'index']);
    Route::post('seasons/{id}/games', [GameController::class, 'store']);
    Route::get('seasons/{id}/standings', [GameController::class, 'standings']);
    Route::get('seasons/{id}/leaderboard', [GameController::class, 'leaderboard']);
    Route::get('seasons/{id}/summary', [GameController::class, 'summary']);

    Route::post('games/{id}/stats', [GameController::class, 'stats']);

    Route::post('games/{id}/result', [GameController::class, 'result']);

});