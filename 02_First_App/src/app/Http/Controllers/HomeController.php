<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class HomeController extends Controller
{
    public function index(): View
    {
        return view('home', [
            'appName' => config('app.name', 'Laravel Student Project'),
            'features' => [
                'Clean MVC architecture using a dedicated controller and view',
                'Responsive layout built with Tailwind CSS and Vite',
                'Ready for local development and production deployment',
                'Simple, user-friendly interface for a school project',
            ],
        ]);
    }

    public function about(): View
    {
        return view('about', [
            'appName' => config('app.name', 'Laravel Student Project'),
        ]);
    }
}
