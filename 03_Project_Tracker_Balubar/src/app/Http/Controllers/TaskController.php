<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the tasks.
     */
    public function index(Request $request)
    {
        $tasks = Task::whereHas('project', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->when($request->project_id, function ($query) use ($request) {
                $query->where('project_id', $request->project_id);
            })
            ->when($request->status, function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->with('project')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $projects = Project::where('user_id', auth()->id())
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'projects' => $projects,
            'filters' => $request->only(['project_id', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new task.
     */
    public function create(Request $request)
    {
        $projects = Project::where('user_id', auth()->id())
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Tasks/Create', [
            'projects' => $projects,
            'selected_project' => $request->project_id,
        ]);
    }

    /**
     * Store a newly created task in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'due_date' => 'nullable|date',
        ]);

        // Verify project belongs to user
        $project = Project::where('id', $validated['project_id'])
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $project->tasks()->create($validated);

        return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
    }

    /**
     * Show the form for editing the specified task.
     */
    public function edit(Task $task)
    {
        $this->authorizeTask($task);

        $projects = Project::where('user_id', auth()->id())
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Tasks/Edit', [
            'task' => $task,
            'projects' => $projects,
        ]);
    }

    /**
     * Update the specified task in storage.
     */
    public function update(Request $request, Task $task)
    {
        $this->authorizeTask($task);

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'due_date' => 'nullable|date',
        ]);

        // Verify project belongs to user
        Project::where('id', $validated['project_id'])
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $task->update($validated);

        return redirect()->route('tasks.index')->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy(Task $task)
    {
        $this->authorizeTask($task);

        $task->delete();

        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
    }

    /**
     * Authorize that the user owns the task's project.
     */
    private function authorizeTask(Task $task)
    {
        $task->load('project');
        if ($task->project->user_id !== auth()->id()) {
            abort(403);
        }
    }
}
