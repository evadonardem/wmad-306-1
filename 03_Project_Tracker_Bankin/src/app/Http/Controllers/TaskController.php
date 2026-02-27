<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function updateStatus(Request $request, Task $task)
    {
        $validated = $request->validate([
            'status' => 'required|in:unfinished,finished,skipped',
        ]);

        $task->update(['status' => $validated['status']]);

        $project = $task->project->recalculateProgress();

        return response()->json([
            'success' => true,
            'status' => $task->status,
            'project_progress' => $project->progress,
            'project_status' => $project->status,
        ]);
    }

    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $task = $project->tasks()->create([
            'title' => $validated['title'],
            'status' => 'unfinished',
        ]);

        $project->recalculateProgress();

        return response()->json([
            'success' => true,
            'task' => $task,
            'project_progress' => $project->progress,
            'project_status' => $project->status,
        ], 201);
    }

    public function destroy(Task $task)
    {
        $project = $task->project;
        $task->delete();

        $project->recalculateProgress();

        return response()->json([
            'success' => true,
            'project_progress' => $project->progress,
            'project_status' => $project->status,
        ]);
    }
}
