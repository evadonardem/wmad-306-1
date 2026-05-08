<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'Barangay Sports League API') }}</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="manual-page">
        <main class="manual-shell">
            <div class="manual-topbar" aria-hidden="true">
                <span>Barangay Sports League API</span>
                <span>Laravel Sanctum REST API Exercise</span>
            </div>

            <section class="manual-hero" aria-labelledby="manual-title">
                <h1 id="manual-title">Barangay Sports League</h1>
                <h2>Laravel API Exercise</h2>
                <p>Student Development Manual</p>
            </section>

            <section class="manual-table-wrap" aria-label="Project summary">
                <table class="manual-table">
                    <tbody>
                        <tr>
                            <th scope="row">Level</th>
                            <td>Intermediate</td>
                        </tr>
                        <tr>
                            <th scope="row">Platform</th>
                            <td>Laravel 11 + Sanctum</td>
                        </tr>
                        <tr>
                            <th scope="row">Topics Covered</th>
                            <td>RESTful API • Sanctum Auth • Eloquent ORM</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </main>
    </body>
</html>
