<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>About | {{ $appName }}</title>

        @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
            @vite(['resources/css/app.css', 'resources/js/app.js'])
        @else
            <style>
                :root {
                    color-scheme: light dark;
                    font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
                }

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    min-height: 100vh;
                    background: #f8fafc;
                    color: #0f172a;
                }

                .page {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    gap: 1.5rem;
                }

                .card {
                    width: 100%;
                    max-width: 880px;
                    background: white;
                    border-radius: 1rem;
                    box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
                    padding: 2rem;
                }

                .button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.9rem 1.3rem;
                    border-radius: 0.75rem;
                    background: #ef4444;
                    color: white;
                    font-weight: 700;
                    text-decoration: none;
                }
            </style>
        @endif
    </head>
    <body>
        <div class="page">
            <nav style="display: flex; justify-content: flex-end; gap: 0.75rem; width: 100%; max-width: 880px;">
                <a href="{{ route('home') }}" style="font-weight: 700; color: #ef4444; text-decoration: none;">Home</a>
                <a href="{{ route('about') }}" style="font-weight: 700; color: #0f172a; text-decoration: none;">About</a>
            </nav>
            <div class="card">
                <h1 style="margin: 0 0 1rem; font-size: clamp(2rem, 4vw, 3rem);">About this Project</h1>
                <p style="margin: 0 0 1rem; font-size: 1.05rem; line-height: 1.75; color: #475569;">
                    This Laravel student project is built using a clean MVC structure with dedicated routes, controllers, and views. It is designed to be easy for your teacher to run and review.
                </p>
                <ul style="padding-left: 1.25rem; margin: 0; color: #334155; font-size: 1rem; line-height: 1.75;">
                    <li>Laravel 12 application structure</li>
                    <li>Responsive homepage and navigation</li>
                    <li>Simple feature list and project instructions</li>
                    <li>Automated test added for the homepage</li>
                </ul>
                <a class="button" href="{{ route('home') }}">Back to Home</a>
            </div>
        </div>
    </body>
</html>
