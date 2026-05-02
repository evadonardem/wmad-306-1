<?php

namespace App\Http\Controllers;

use App\Models\Player;
use App\Models\Team;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    public function index(Request $request)
    {
        return $this->successResponse(
            Player::query()
                ->with(['teams.season.league', 'stats.gameResult.game'])
                ->whereHas('teams.season.league', fn ($query) => $query->where('user_id', $request->user()->id))
                ->get(),
            'Players loaded'
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'birthdate' => 'nullable|date',
            'position' => 'nullable|string|max:255',
            'team_id' => 'nullable|integer|exists:teams,id',
            'jersey_number' => 'nullable|integer|min:0',
        ]);

        $player = Player::create([
            'name' => $data['name'],
            'birthdate' => $data['birthdate'] ?? null,
            'position' => $data['position'] ?? null,
        ]);

        if (! empty($data['team_id'])) {
            $team = Team::with('season.league')->findOrFail($data['team_id']);
            abort_unless($team->season->league->user_id === $request->user()->id, 403);

            $player->teams()->syncWithoutDetaching([
                $team->id => ['jersey_number' => $data['jersey_number'] ?? null],
            ]);
        }

        return $this->successResponse($player->load(['teams.season.league', 'stats.gameResult.game']), 'Player created', 201);
    }

    public function show(Request $request, Player $player)
    {
        abort_unless(
            $player->teams()->whereHas('season.league', fn ($query) => $query->where('user_id', $request->user()->id))->exists(),
            403
        );

        return $this->successResponse($player->load(['teams.season.league', 'stats.gameResult.game']), 'Player loaded');
    }

    public function update(Request $request, Player $player)
    {
        abort_unless(
            $player->teams()->whereHas('season.league', fn ($query) => $query->where('user_id', $request->user()->id))->exists(),
            403
        );

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'birthdate' => 'sometimes|nullable|date',
            'position' => 'sometimes|nullable|string|max:255',
            'team_id' => 'nullable|integer|exists:teams,id',
            'jersey_number' => 'nullable|integer|min:0',
        ]);

        $player->update(array_intersect_key($data, array_flip(['name', 'birthdate', 'position'])));

        if (! empty($data['team_id'])) {
            $team = Team::with('season.league')->findOrFail($data['team_id']);
            abort_unless($team->season->league->user_id === $request->user()->id, 403);

            $player->teams()->syncWithoutDetaching([
                $team->id => ['jersey_number' => $data['jersey_number'] ?? null],
            ]);
        }

        return $this->successResponse($player->load(['teams.season.league', 'stats.gameResult.game']), 'Player updated');
    }

    public function destroy(Request $request, Player $player)
    {
        abort_unless(
            $player->teams()->whereHas('season.league', fn ($query) => $query->where('user_id', $request->user()->id))->exists(),
            403
        );

        $player->delete();

        return $this->successResponse(null, 'Player deleted');
    }
}