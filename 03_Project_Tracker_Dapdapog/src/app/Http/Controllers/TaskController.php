<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;

class TaskController extends Controller
{
    /**
     * Display a listing of the tasks for a given project.
     */
    public function index(Project $project)
    {
        $this->authorize('view', $project);

        return inertia('Tasks/Index', [
            'project' => $project->load('tasks'),
        ]);
    }

    /**
     * Store a newly created task under specified project.
     */
    public function store(StoreTaskRequest $request, Project $project)
    {
        $this->authorize('update', $project);

        $project->tasks()->create($request->validated());

        return redirect()->back();
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        // user must own the parent project
        $this->authorize('update', $task);

        $task->update($request->validated());

        return redirect()->back();
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $task->delete();

        return redirect()->back();
    }

    /**
     * Toggle a task's status between pending/completed.
     */
    public function toggleStatus(Task $task)
    {
        $this->authorize('update', $task);

        $task->status = $task->status === 'completed' ? 'pending' : 'completed';
        $task->save();

        return redirect()->back();
    }
}
