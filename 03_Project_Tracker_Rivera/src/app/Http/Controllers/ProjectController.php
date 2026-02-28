<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Project::class);

        $userId = $request->user()->id;

        $projects = Project::query()
            ->where('user_id', $userId)
            ->latest()
            ->withCount('tasks')
            ->get();

        $tasksCount = Task::query()->whereHas('project', function ($query) use ($userId): void {
            $query->where('user_id', $userId);
        })->count();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'stats' => [
                'projects' => $projects->count(),
                'tasks' => $tasksCount,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort(404);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Project::class);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        Project::create([
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        return Redirect::back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        $tasks = Task::query()
            ->where('project_id', $project->id)
            ->latest()
            ->get();

        if ($request->wantsJson()) {
            return response()->json([
                'project' => [
                    'id' => $project->id,
                    'title' => $project->title,
                    'description' => $project->description,
                ],
                'tasks' => $tasks->map(fn (Task $task) => [
                    'id' => $task->id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'priority' => $task->priority,
                    'status' => $task->status,
                    'created_at' => optional($task->created_at)->toISOString(),
                    'updated_at' => optional($task->updated_at)->toISOString(),
                ])->values(),
            ]);
        }

        $byPriority = [
            'low' => $tasks->where('priority', 'low')->values(),
            'medium' => $tasks->where('priority', 'medium')->values(),
            'high' => $tasks->where('priority', 'high')->values(),
        ];

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'tasks' => $byPriority,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        abort(404);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $project->update($validated);

        return Redirect::back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        $project->delete();

        return Redirect::route('projects.index');
    }
}
