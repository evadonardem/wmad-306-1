<?php

namespace App\Policies;

use App\Models\League;
use App\Models\User;

class LeaguePolicy
{
    /**
     * Determine if the user can view the league
     */
    public function view(User $user, League $league): bool
    {
        return $user->id === $league->user_id;
    }

    /**
     * Determine if the user can update the league
     */
    public function update(User $user, League $league): bool
    {
        return $user->id === $league->user_id;
    }

    /**
     * Determine if the user can delete the league
     */
    public function delete(User $user, League $league): bool
    {
        return $user->id === $league->user_id;
    }
}
