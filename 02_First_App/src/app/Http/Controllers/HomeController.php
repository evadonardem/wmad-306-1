<?php

namespace App\Http\Controllers;

/**
 * Controller for handling homepage and about page routes.
 */
class HomeController extends Controller
{
    /**
     * Display the homepage.
     *
     * @return mixed
     */
    public function index()
    {
        return view('home', [
            'appName' => config('app.name', 'first_app'),
            'features' => [
                'Clean MVC architecture using a dedicated controller and view',
                'Responsive layout built with Tailwind CSS and Vite',
                'Ready for local development and production deployment',
                'Simple, user-friendly interface for a school project',
            ],
        ]);
    }

    /**
     * Display the about page.
     *
     * @return mixed
     */
    public function about()
    {
        return view('about', [
            'appName' => config('app.name', 'first_app'),
        ]);
    }
}
