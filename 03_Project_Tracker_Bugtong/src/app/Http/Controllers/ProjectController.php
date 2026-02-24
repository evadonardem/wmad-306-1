<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * API endpoint: return all projects with tasks for authenticated user
     */
    public function apiIndex()
    {
        $projects = auth()->user()->projects()->with('tasks')->get();
        return response()->json($projects);
    }

    /**
     * Web endpoint: list all projects for authenticated user
     */
    public function index()
    {
        return inertia('Projects/Projects', [
            'projects' => auth()->user()->projects()->with('tasks')->get(),
        ]);
    }

    /**
     * Add other methods like store, update, destroy if needed
     */
}