<?php

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

Route::post('register', fn() => 'Register a new admin user. Returns user + token.');
Route::post('login', fn() => 'Authenticate and receive a Sanctum API token.');
Route::post('logout', fn() => 'Revoke the current token. Requires auth.');
