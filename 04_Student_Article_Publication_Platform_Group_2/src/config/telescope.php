<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Telescope Enabled
    |--------------------------------------------------------------------------
    |
    | This value controls whether Telescope is enabled for your application.
    | Please note that Telescope is intended for local development only
    | and should generally be disabled in production.
    |
    */
    'enabled' => env('TELESCOPE_ENABLED', false),

    /*
    |--------------------------------------------------------------------------
    | Telescope Path
    |--------------------------------------------------------------------------
    |
    | This is the URI path where Telescope will be accessible.
    |
    */
    'path' => env('TELESCOPE_PATH', 'telescope'),
];
