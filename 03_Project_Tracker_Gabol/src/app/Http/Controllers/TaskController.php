<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TaskController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of tasks for a project.
     */
    public function index(Project $project)
    {
        $this->authorize('view', $project);

        $tasks = $project->tasks()->orderBy('order')->get();

        return response()->json([
            'data' => $tasks,
        ]);
    }

    /**
     * Store a newly created task in storage.
     */
    public function store(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,completed,on_hold',
            'priority' => 'required|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'order' => 'nullable|integer',
        ]);

        $task = $project->tasks()->create($validated);

        return response()->json([
            'data' => $task,
        ], 201);
    }

    /**
     * Display the specified task.
     */
    public function show(Project $project, Task $task)
    {
        $this->authorize('view', $project);

        if ($task->project_id !== $project->id) {
            abort(404);
        }

        return response()->json([
            'data' => $task,
        ]);
    }

    /**
     * Update the specified task in storage.
     */
    public function update(Request $request, Project $project, Task $task)
    {
        $this->authorize('update', $project);

        if ($task->project_id !== $project->id) {
            abort(404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,completed,on_hold',
            'priority' => 'required|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'order' => 'nullable|integer',
        ]);

        $task->update($validated);

        return response()->json([
            'data' => $task,
        ]);
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy(Project $project, Task $task)
    {
        $this->authorize('delete', $project);

        if ($task->project_id !== $project->id) {
            abort(404);
        }

        $task->delete();

        return response()->json(null, 204);
    }
}
