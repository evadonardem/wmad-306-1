<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Show the application dashboard.
     */
    public function index()
    {
        // load all projects for the authenticated user along with their tasks
        $projects = auth()->user()->projects()->with('tasks')->get();

        return inertia('Dashboard', [
            'projects' => $projects,
        ]);
    }
}
