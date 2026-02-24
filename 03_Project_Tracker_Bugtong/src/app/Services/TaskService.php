<?php

namespace App\Services;

use App\Models\Task;
use App\Models\Project;

class TaskService
{
    public function listForProject(Project $project)
    {
        return $project->tasks()->get();
    }

    public function createForProject(Project $project, array $data)
    {
        return $project->tasks()->create($data);
    }

    public function update(Task $task, array $data)
    {
        $task->update($data);
        return $task->fresh();
    }

    public function delete(Task $task)
    {
        return $task->delete();
    }

    public function toggleStatus(Task $task)
    {
        $task->status = $task->status === 'done' ? 'todo' : 'done';
        $task->save();
        return $task->fresh();
    }
}
