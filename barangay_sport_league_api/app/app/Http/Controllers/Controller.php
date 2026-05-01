<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\League;
use App\Models\Player;
use App\Models\Season;
use App\Models\Team;
use Illuminate\Http\Request;

abstract class Controller
{
    protected function leagueForUser(Request $request, int|string $id): ?League
    {
        return $request->user()->leagues()->whereKey($id)->first();
    }

    protected function seasonForUser(Request $request, int|string $id): ?Season
    {
        return Season::query()
            ->whereKey($id)
            ->whereHas('league', fn ($query) => $query->where('user_id', $request->user()->id))
            ->first();
    }

    protected function teamForUser(Request $request, int|string $id): ?Team
    {
        return Team::query()
            ->whereKey($id)
            ->whereHas('season.league', fn ($query) => $query->where('user_id', $request->user()->id))
            ->first();
    }

    protected function gameForUser(Request $request, int|string $id): ?Game
    {
        return Game::query()
            ->whereKey($id)
            ->whereHas('season.league', fn ($query) => $query->where('user_id', $request->user()->id))
            ->first();
    }

    protected function playerForUser(Request $request, int|string $id): ?Player
    {
        return Player::query()
            ->whereKey($id)
            ->whereHas('teams.season.league', fn ($query) => $query->where('user_id', $request->user()->id))
            ->first();
    }

    protected function notFound(string $resource)
    {
        return response()->json(['message' => "{$resource} not found."], 404);
    }
}
