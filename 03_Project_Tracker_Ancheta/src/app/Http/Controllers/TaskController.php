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
     * Tasks only exist within the context of a project.
     * There is no global tasks index - use ProjectController::show to view tasks.
     */

    /**
     * Store a newly created task in a project.
     */
    public function store(Request $request, Project $project)
    {
        $this->authorize('create', [Task::class, $project]);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|string|in:low,medium,high',
            'status' => 'required|string|in:pending,in_progress,completed',
        ]);

        $task = $project->tasks()->create([
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority,
            'status' => $request->status,
            'user_id' => $request->user()->id,
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Task created successfully.',
                'task' => $task->fresh(),
                'project' => $project->fresh(),
            ]);
        }

        return redirect()->route('projects.show', $project)
            ->with('success', 'Task created successfully.');
    }

    /**
     * Update the specified task.
     */
    public function update(Request $request, Project $project, Task $task)
    {
        $this->authorize('update', $task);

        // Ensure task belongs to the project
        if ($task->project_id !== $project->id) {
            abort(404, 'Task not found in this project.');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|string|in:low,medium,high',
            'status' => 'required|string|in:pending,in_progress,completed',
        ]);

        $task->update([
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority,
            'status' => $request->status,
        ]);

        // Reload project to recalculate progress
        $project->refresh();

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Task updated successfully.',
                'task' => $task->fresh(),
                'project' => $project->fresh(),
            ]);
        }

        return redirect()->route('projects.show', $project)
            ->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Request $request, Project $project, Task $task)
    {
        $this->authorize('delete', $task);

        // Ensure task belongs to the project
        if ($task->project_id !== $project->id) {
            abort(404, 'Task not found in this project.');
        }

        $task->delete();

        // Reload project to recalculate progress
        $project->refresh();

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Task deleted successfully.',
                'project' => $project->fresh(),
            ]);
        }

        return redirect()->route('projects.show', $project)
            ->with('success', 'Task deleted successfully.');
    }

    /**
     * Toggle task status through progression: pending -> in_progress -> completed -> completed (locked).
     */
    public function toggleStatus(Request $request, Project $project, Task $task)
    {
        $this->authorize('update', $task);

        // Ensure task belongs to the project
        if ($task->project_id !== $project->id) {
            abort(404, 'Task not found in this project.');
        }

        // Toggle status through the progression
        $statusProgression = [
            'pending' => 'in_progress',
            'in_progress' => 'completed',
            'completed' => 'completed', // Locked at completed
        ];

        $currentStatus = $task->status ?? 'pending';
        $nextStatus = $statusProgression[$currentStatus] ?? 'pending';

        $task->update(['status' => $nextStatus]);

        // Reload project to recalculate progress
        $project->refresh();

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Task status toggled successfully.',
                'task' => $task->fresh(),
                'project' => $project->fresh(),
            ]);
        }

        return redirect()->route('projects.show', $project)
            ->with('success', 'Task status updated successfully.');
    }

    /**
     * Update task status directly (not just toggle)
     */
    public function updateStatus(Request $request, Project $project, Task $task)
    {
        $this->authorize('update', $task);

        // Ensure task belongs to the project
        if ($task->project_id !== $project->id) {
            abort(404, 'Task not found in this project.');
        }

        $request->validate([
            'status' => 'required|string|in:pending,in_progress,completed',
        ]);

        $task->update(['status' => $request->status]);

        // Reload project to recalculate progress
        $project->refresh();

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Task status updated successfully.',
                'task' => $task->fresh(),
                'project' => $project->fresh(),
            ]);
        }

        return redirect()->route('projects.show', $project)
            ->with('success', 'Task status updated successfully.');
    }
}
