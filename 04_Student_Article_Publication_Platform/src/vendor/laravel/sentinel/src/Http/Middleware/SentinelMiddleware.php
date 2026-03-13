<?php

namespace Laravel\Sentinel\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sentinel\Sentinel;

class SentinelMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ?string $driver = null)
    {
        abort_unless(Sentinel::driverOrFallback($driver)->authorize($request), 401);

        return $next($request);
    }
}
