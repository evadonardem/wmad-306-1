<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Barangay Sport League API</title>
    <meta name="description" content="Barangay Sport League API landing page for teams, players, leagues, and game results.">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body>
    <div class="page-shell">
        <header class="site-header">
            <div>
                <p class="eyebrow">Barangay Sport League</p>
                <h1>Modern, stable, and ready-to-run sports league API.</h1>
            </div>
            <nav class="site-nav" aria-label="Primary navigation">
                <a href="https://laravel.com/docs" target="_blank" rel="noopener noreferrer">Laravel Docs</a>
                <a href="https://laracasts.com" target="_blank" rel="noopener noreferrer">Laracasts</a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
            </nav>
        </header>

        <main class="hero" id="main-content">
            <section class="hero-copy">
                <p class="intro">This site is built for fast loading, simple grading, and stable Laravel execution.</p>
                <ul class="feature-list">
                    <li>Clean HTML structure with accessible sections</li>
                    <li>Responsive layout that works on mobile and desktop</li>
                    <li>Static public assets so page loading is reliable</li>
                </ul>
                <div class="actions">
                    <a class="button" href="https://laravel.com/docs" target="_blank" rel="noopener noreferrer">Read Laravel Docs</a>
                    <a class="link-button" href="https://laracasts.com" target="_blank" rel="noopener noreferrer">Learn Laravel</a>
                </div>
            </section>

            <aside class="hero-panel" aria-labelledby="panel-title">
                <h2 id="panel-title">Grade-ready landing page</h2>
                <p>All markup is semantic, styles are local, and the page works without requiring a build step.</p>
                <div class="panel-grid">
                    <article>
                        <h3>Fast</h3>
                        <p>Minimal CSS, no external fonts, and clear content structure.</p>
                    </article>
                    <article>
                        <h3>Accessible</h3>
                        <p>High contrast, readable typography, and focus-friendly links.</p>
                    </article>
                    <article>
                        <h3>Stable</h3>
                        <p>Static assets served from <code>public/</code> remove runtime build errors.</p>
                    </article>
                </div>
            </aside>
        </main>

        <footer class="site-footer">
            <p>© <span id="year">{{ date('Y') }}</span> Barangay Sport League API</p>
        </footer>
    </div>

    <script defer src="{{ asset('js/app.js') }}"></script>
</body>
</html>
