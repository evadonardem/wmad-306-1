<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Services\TaskService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // List all tasks for projects owned by the authenticated user and render Inertia view
        $tasks = auth()->user()->projects()->with('tasks')->get()->pluck('tasks')->flatten();
        return \Inertia\Inertia::render('Tasks/Index', [
            'tasks' => $tasks
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request, Project $project)
    {
        // Validate and create a new task for a project owned by the user
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'nullable|string',
            'status' => 'nullable|string',
        ]);
        // Ensure the project belongs to the user
        $project = auth()->user()->projects()->findOrFail($validated['project_id']);
        $task = $project->tasks()->create($validated);
        return response()->json($task, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Show a single task if it belongs to a project owned by the user and render Inertia view
        $task = auth()->user()->projects()->with('tasks')->get()->pluck('tasks')->flatten()->where('id', $id)->first();
        if (!$task) {
            abort(404);
        }
        return \Inertia\Inertia::render('Tasks/Show', [
            'task' => $task
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Project $project, Task $task)
    {
        // Update a task if it belongs to a project owned by the user
        $task = auth()->user()->projects()->with('tasks')->get()->pluck('tasks')->flatten()->where('id', $id)->first();
        if (!$task) {
            abort(404);
        }
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'nullable|string',
            'status' => 'nullable|string',
        ]);
        $task->update($validated);
        return response()->json($task);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, Task $task)
    {
        // Delete a task if it belongs to a project owned by the user
        $task = auth()->user()->projects()->with('tasks')->get()->pluck('tasks')->flatten()->where('id', $id)->first();
        if (!$task) {
            abort(404);
        }
        $task->delete();
        return response()->json(['message' => 'Task deleted']);
    }
    
    public function toggleStatus(Project $project, Task $task)
    {
        $this->authorize('update', $task);
        $this->service->toggleStatus($task);
        return redirect()->route('projects.show', $project)->with('success', 'Task status updated!');
    }
}
