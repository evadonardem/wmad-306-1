<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(Project $project): Response
    {
        $this->authorize('view', $project);

        $tasks = $project
            ->tasks()
            ->latest()
            ->get()
            ->map(fn (Task $task) => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'priority' => $task->priority,
                'status' => $task->status,
                'created_at' => $task->created_at?->toISOString(),
            ]);

        return Inertia::render('Tasks/Index', [
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'description' => $project->description,
            ],
            'tasks' => $tasks,
        ]);
    }

    public function store(StoreTaskRequest $request, Project $project): RedirectResponse
    {
        $validated = $request->validated();

        $project->tasks()->create($validated);

        return redirect()->route('projects.tasks.index', $project);
    }

    public function update(UpdateTaskRequest $request, Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        $task->update($request->validated());

        return redirect()->route('projects.tasks.index', $task->project);
    }

    public function destroy(Task $task): RedirectResponse
    {
        $this->authorize('delete', $task);

        $project = $task->project;
        $task->delete();

        return redirect()->route('projects.tasks.index', $project);
    }

    public function toggleStatus(Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        $statuses = ['todo', 'doing', 'done'];
        $currentIndex = array_search($task->status, $statuses, true);
        $nextIndex = $currentIndex === false ? 0 : (($currentIndex + 1) % count($statuses));

        $task->update([
            'status' => $statuses[$nextIndex],
        ]);

        return redirect()->route('projects.tasks.index', $task->project);
    }
}
