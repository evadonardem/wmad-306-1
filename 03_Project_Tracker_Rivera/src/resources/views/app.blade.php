<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/taskmo-logo.png') }}?v=2">
        <link rel="icon" type="image/png" sizes="192x192" href="{{ asset('images/taskmo-logo.png') }}?v=2">
        <link rel="icon" type="image/png" sizes="512x512" href="{{ asset('images/taskmo-logo.png') }}?v=2">
        <link rel="shortcut icon" type="image/png" href="{{ asset('images/taskmo-logo.png') }}?v=2">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('images/taskmo-logo.png') }}?v=2">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
