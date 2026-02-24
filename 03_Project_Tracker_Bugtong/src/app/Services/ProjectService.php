<?php

namespace App\Services;

use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ProjectService
{
    public function listForUser(User $user)
    {
        return $user->projects()->with('tasks')->get();
    }

    public function createForUser(User $user, array $data)
    {
        return $user->projects()->create($data);
    }

    public function update(Project $project, array $data)
    {
        $project->update($data);
        return $project->fresh();
    }

    public function delete(Project $project)
    {
        return $project->delete();
    }
}
