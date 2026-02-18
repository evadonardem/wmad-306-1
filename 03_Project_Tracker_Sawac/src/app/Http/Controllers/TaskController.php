<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Project $project)
    {
        $this->authorize('view', $project);

        $tasks = $project->tasks()->latest()->get();

        return Inertia::render('Tasks/Index', [
            'project' => $project,
            'tasks' => $tasks,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Project $project)
    {
        $this->authorize('create', [Task::class, $project]);

        return Inertia::render('Tasks/Create', [
            'project' => $project,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Project $project)
    {
        $this->authorize('create', [Task::class, $project]);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'status' => 'required|in:pending,in-progress,completed',
        ]);

        $project->tasks()->create($validated);

        return redirect()->route('tasks.index', $project->id)->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project, Task $task)
    {
        $this->authorize('view', $project);
        $this->authorize('view', $task);

        return Inertia::render('Tasks/Show', [
            'project' => $project,
            'task' => $task,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project, Task $task)
    {
        $this->authorize('view', $project);
        $this->authorize('update', $task);

        return Inertia::render('Tasks/Edit', [
            'project' => $project,
            'task' => $task,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project, Task $task)
    {
        $this->authorize('view', $project);
        $this->authorize('update', $task);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'status' => 'required|in:pending,in-progress,completed',
        ]);

        $task->update($validated);

        return redirect()->route('tasks.index', $project->id)->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, Task $task)
    {
        $this->authorize('view', $project);
        $this->authorize('delete', $task);

        $task->delete();

        return redirect()->route('tasks.index', $project->id)->with('success', 'Task deleted successfully.');
    }

    /**
     * Toggle the status of a task.
     */
    public function toggleStatus(Project $project, Task $task)
    {
        $this->authorize('view', $project);
        $this->authorize('update', $task);

        $statuses = ['pending', 'in-progress', 'completed'];
        $currentIndex = array_search($task->status, $statuses);
        $nextIndex = ($currentIndex + 1) % count($statuses);

        $task->update(['status' => $statuses[$nextIndex]]);

        return redirect()->route('tasks.index', $project->id)->with('success', 'Task status updated.');
    }
}
