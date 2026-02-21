<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::with('project')->whereHas('project', function ($q) {
            $q->where('user_id', request()->user()->id);
        })->get();

        $projects = request()->user()->projects()->select(['id','title'])->get();

        return Inertia::render('Tasks', [
            'tasks' => $tasks,
            'projects' => $projects,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'nullable|string',
        ]);

        $project = Project::findOrFail($data['project_id']);
        $this->authorize('update', $project);

        Task::create(array_merge($data, ['status' => 'todo']));

        return redirect()->back();
    }

    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task->project);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        $task->update($data);

        return redirect()->back();
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task->project);
        $task->delete();

        return redirect()->back();
    }

    public function toggleStatus(Task $task)
    {
        $this->authorize('update', $task->project);

        $task->status = $task->status === 'done' ? 'todo' : 'done';
        $task->save();

        return redirect()->back();
    }
}
