<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    /**
     * Determine if the user can view the team
     */
    public function view(User $user, Team $team): bool
    {
        return $user->id === $team->user_id;
    }

    /**
     * Determine if the user can update the team
     */
    public function update(User $user, Team $team): bool
    {
        return $user->id === $team->user_id;
    }

    /**
     * Determine if the user can delete the team
     */
    public function delete(User $user, Team $team): bool
    {
        return $user->id === $team->user_id;
    }
}
