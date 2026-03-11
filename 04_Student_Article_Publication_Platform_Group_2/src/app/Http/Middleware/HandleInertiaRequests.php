<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{

    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [

            ...parent::share($request),

            'auth' => [
                'user' => $request->user()
                    ? $request->user()->load('roles')
                    : null,

                'notifications' => $request->user()
                    ? $request->user()->unreadNotifications->map(function ($notification) {
                        return [
                            'id' => $notification->id,
                            'message' => $notification->data['message'] ?? '',
                            'url' => $notification->data['url'] ?? null,
                            'created_at' => $notification->created_at->diffForHumans(),
                        ];
                    })
                    : [],
            ],

        ];
    }
}