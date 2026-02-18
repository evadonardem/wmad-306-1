<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use App\Models\Project;

class TaskPolicy
{
    /**
     * User must be the project owner to create tasks.
     */
    public function create(User $user, Project $project): bool
    {
        return $user->id === $project->user_id;
    }

    /**
     * User must be the project owner to view the task.
     */
    public function view(User $user, Task $task): bool
    {
        return $user->id === $task->project->user_id;
    }

    /**
     * User must be the project owner to update the task.
     */
    public function update(User $user, Task $task): bool
    {
        return $user->id === $task->project->user_id;
    }

    /**
     * User must be the project owner to delete the task.
     */
    public function delete(User $user, Task $task): bool
    {
        return $user->id === $task->project->user_id;
    }
}
