<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class ProjectController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the user's projects.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $projects = $user->projects()
                ->withCount('tasks')
                ->latest()
                ->get();
        } else {
            // Fallback for seeded/demo data when not authenticated
            $projects = Project::withCount('tasks')
                ->latest()
                ->get();
        }

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'can' => [
                'create_project' => $request->user()->can('create', Project::class),
            ]
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project = $request->user()->projects()->create([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return redirect()->route('projects.index')
            ->with('success', 'Project created successfully.');
    }

    /**
     * Display the specified project with its tasks.
     */
    public function show(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        $project->load(['tasks' => function($query) {
            $query->latest();
        }]);

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'can' => [
                'update_project' => $request->user()->can('update', $project),
                'delete_project' => $request->user()->can('delete', $project),
                'create_task' => $request->user()->can('create', [Task::class, $project]),
                // Per-task permissions are determined per-task in the frontend.
                // Provide project-level shortcuts: only project owner may manage tasks here.
                'update_task' => $request->user()->id === $project->user_id,
                'delete_task' => $request->user()->id === $project->user_id,
            ]
        ]);
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return redirect()->route('projects.index')
            ->with('success', 'Project updated successfully.');
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}
