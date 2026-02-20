<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class TaskController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $projects = $request->user()->projects()->get();
        $tasks = Task::whereIn('project_id', $projects->pluck('id'))
            ->with('project')
            ->latest()
            ->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $projects = $request->user()->projects()->get();

        return Inertia::render('Tasks/Create', [
            'projects' => $projects,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        // Verify the project belongs to the user
        $project = $request->user()->projects()->findOrFail($validated['project_id']);

        $project->tasks()->create($validated);

        return redirect()->route('tasks.index')
            ->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        $this->authorize('view', $task);

        $task->load('project');

        return Inertia::render('Tasks/Show', [
            'task' => $task,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $projects = $request->user()->projects()->get();

        return Inertia::render('Tasks/Edit', [
            'task' => $task,
            'projects' => $projects,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        // Verify the project belongs to the user
        $project = $request->user()->projects()->findOrFail($validated['project_id']);

        $task->update($validated);

        return redirect()->route('tasks.index')
            ->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $task->delete();

        return redirect()->route('tasks.index')
            ->with('success', 'Task deleted successfully.');
    }

    /**
     * Toggle the status of a task.
     */
    public function toggleStatus(Task $task)
    {
        $this->authorize('update', $task);

        $statusOrder = ['pending', 'in_progress', 'completed'];
        $currentIndex = array_search($task->status, $statusOrder);
        $nextIndex = ($currentIndex + 1) % count($statusOrder);

        $task->update(['status' => $statusOrder[$nextIndex]]);

        return back()->with('success', 'Task status updated.');
    }
}
