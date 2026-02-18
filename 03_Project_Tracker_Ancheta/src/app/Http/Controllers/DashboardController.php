<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get user's projects and tasks
        $projects = $user->projects()->with('tasks')->latest()->get();
        $tasks = $user->tasks()->with('project')->latest()->get();

        // Calculate stats
        $totalProjects = $projects->count();
        $totalTasks = $tasks->count();
        $pendingTasks = $tasks->where('status', 'pending')->count();
        $inProgressTasks = $tasks->where('status', 'in_progress')->count();
        $completedTasks = $tasks->where('status', 'completed')->count();
        $highPriorityTasks = $tasks->where('priority', 'high')->count();

        // Get priority breakdown (support both string and numeric formats)
        $priorityBreakdown = [
            'low' => $tasks->where('priority', 'low')->count() + $tasks->where('priority', 1)->count(),
            'medium' => $tasks->where('priority', 'medium')->count() + $tasks->where('priority', 2)->count(),
            'high' => $tasks->where('priority', 'high')->count() + $tasks->where('priority', 3)->count(),
        ];

        // Get recent activity (last 5 tasks created or updated)
        $recentActivity = $tasks->take(5);

        // Add progress attribute to projects
        $projectsData = $projects->map(function ($project) {
            return [
                'id' => $project->id,
                'title' => $project->title,
                'description' => $project->description,
                'user_id' => $project->user_id,
                'progress' => $project->progress, // Uses the getProgressAttribute
                'tasks_count' => $project->tasks->count(),
                'created_at' => $project->created_at,
                'updated_at' => $project->updated_at,
            ];
        });

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalProjects' => $totalProjects,
                'totalTasks' => $totalTasks,
                'pendingTasks' => $pendingTasks,
                'inProgressTasks' => $inProgressTasks,
                'completedTasks' => $completedTasks,
                'highPriorityTasks' => $highPriorityTasks,
            ],
            'priorityBreakdown' => $priorityBreakdown,
            'recentActivity' => $recentActivity,
            'projects' => $projectsData,
        ]);
    }
}
