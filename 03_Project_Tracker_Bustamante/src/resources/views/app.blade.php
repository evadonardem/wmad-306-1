<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700,800&display=swap" rel="stylesheet" />

        <!-- Inertia + Vite Integration -->
        <!-- routes directive: Exposes named Laravel routes to JS (Ziggy) -->
        @routes
        <!-- viteReactRefresh directive: Enables React Fast Refresh in dev -->
        @viteReactRefresh
        <!-- vite directive: Loads main app entry and current page component -->
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        <!-- inertiaHead directive: Injects dynamic <head> content from pages -->
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        <!-- Inertia root: React app mounts here -->
        @inertia
    </body>
</html>
