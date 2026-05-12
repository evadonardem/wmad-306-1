<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureArticleAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // If user is admin or teacher, allow access to all articles
        if ($user->hasRole(['admin', 'teacher'])) {
            return $next($request);
        }

        // For students, check if they're accessing their own article
        $articleId = $request->route('article');
        if ($articleId && $articleId->user_id !== $user->id) {
            abort(403, 'You do not have permission to access this article.');
        }

        return $next($request);
    }
}