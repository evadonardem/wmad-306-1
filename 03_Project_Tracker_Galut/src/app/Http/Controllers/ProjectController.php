<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the user's projects with stats.
     */
    public function index()
    {
        $user = auth()->user();
        
        $projects = $user->projects()->with('tasks')->get();
        
        $stats = [
            'totalProjects' => $projects->count(),
            'completedProjects' => $projects->where('status', 'completed')->count(),
            'pendingProjects' => $projects->where('status', 'pending')->count(),
            'totalTasks' => $projects->flatMap(function ($project) {
                return $project->tasks;
            })->count(),
            'completedTasks' => $projects->flatMap(function ($project) {
                return $project->tasks;
            })->where('status', 'completed')->count(),
            'pendingTasks' => $projects->flatMap(function ($project) {
                return $project->tasks;
            })->where('status', 'pending')->count(),
        ];

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $request->user()->projects()->create($validated);

        return redirect()->route('projects.index');
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,completed',
        ]);

        $project->update($validated);

        return redirect()->route('projects.index');
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        $project->delete();

        return redirect()->route('projects.index');
    }

    /**
     * Store a new task for a project.
     */
    public function storeTask(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        $project->tasks()->create($validated);

        return redirect()->route('projects.index');
    }

    /**
     * Update a task.
     */
    public function updateTask(Request $request, Task $task)
    {
        $this->authorize('update', $task->project);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,completed',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);

        return redirect()->route('projects.index');
    }

    /**
     * Delete a task.
     */
    public function destroyTask(Task $task)
    {
        $this->authorize('delete', $task->project);

        $task->delete();

        return redirect()->route('projects.index');
    }

    /**
     * Toggle task status.
     */
    public function toggleTask(Task $task)
    {
        $this->authorize('update', $task->project);

        $task->update([
            'status' => $task->status === 'completed' ? 'pending' : 'completed',
        ]);

        return redirect()->route('projects.index');
    }
}
