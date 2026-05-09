<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $appName }} | Student Project</title>

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

                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.55rem 0.9rem;
                    border-radius: 999px;
                    background: #fef3c7;
                    color: #92400e;
                    font-weight: 600;
                    font-size: 0.9rem;
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

                .features {
                    display: grid;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                .feature-item {
                    padding: 1rem;
                    border-radius: 1rem;
                    border: 1px solid #e2e8f0;
                    background: #f8fafc;
                }

                @media (min-width: 768px) {
                    .page {
                        padding: 4rem;
                    }

                    .features {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }
            </style>
        @endif
    </head>
    <body>
        <div class="page">
            <nav style="display: flex; justify-content: flex-end; gap: 0.75rem; width: 100%; max-width: 880px;">
                <a href="{{ route('home') }}" style="font-weight: 700; color: #0f172a; text-decoration: none;">Home</a>
                <a href="{{ route('about') }}" style="font-weight: 700; color: #ef4444; text-decoration: none;">About</a>
            </nav>
            <div class="card">
                <div class="badge">Laravel Student Project</div>
                <h1 style="margin: 1rem 0 0.5rem; font-size: clamp(2rem, 4vw, 3rem); line-height: 1.05;">Welcome to {{ $appName }}</h1>
                <p style="margin: 0; font-size: 1.05rem; line-height: 1.75; color: #475569;">
                    This project is organized with a clean Laravel MVC structure and a responsive homepage. It is ready to run locally or deploy with minimal setup.
                </p>

                <div class="features">
                    @foreach ($features as $feature)
                        <div class="feature-item">
                            <strong>{{ $feature }}</strong>
                        </div>
                    @endforeach
                </div>

                <div style="margin-top: 2rem; display: flex; flex-direction: column; gap: 1rem;">
                    <p style="margin: 0; color: #334155;">To run the app locally, use the commands below from <code style="background: #e2e8f0; padding: 0.2rem 0.45rem; border-radius: 0.35rem;">02_First_App/src</code>:</p>
                    <pre style="background: #0f172a; color: #f8fafc; padding: 1rem; border-radius: 0.75rem; overflow-x: auto;">composer install
cp .env.example .env
php artisan key:generate
npm install
npm run dev
php artisan serve</pre>
                    <a class="button" href="https://laravel.com/docs" target="_blank">Laravel Documentation</a>
                </div>
            </div>
        </div>
    </body>
</html>
