<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TeamController extends Controller
{
    public function index(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);

        return $season ? $season->teams()->with('players')->get() : $this->notFound('Season');
    }

    public function store(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);
        if (! $season) {
            return $this->notFound('Season');
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'coach' => ['nullable', 'string', 'max:255'],
        ]);

        return response()->json($season->teams()->create($data), 201);
    }

    public function show(Request $request, string $team)
    {
        $team = $this->teamForUser($request, $team);

        return $team ? $team->load(['season', 'players']) : $this->notFound('Team');
    }

    public function update(Request $request, string $team)
    {
        $team = $this->teamForUser($request, $team);
        if (! $team) {
            return $this->notFound('Team');
        }

        $team->update($request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'coach' => ['nullable', 'string', 'max:255'],
        ]));

        return $team->fresh('players');
    }

    public function addPlayer(Request $request, string $team)
    {
        $team = $this->teamForUser($request, $team);
        if (! $team) {
            return $this->notFound('Team');
        }

        $data = $request->validate([
            'player_id' => ['nullable', 'integer', Rule::exists('players', 'id')],
            'name' => ['required_without:player_id', 'string', 'max:255'],
            'birthdate' => ['nullable', 'date'],
            'position' => ['nullable', 'string', 'max:255'],
            'jersey_number' => ['required', 'integer', 'min:0'],
        ]);

        $player = isset($data['player_id'])
            ? Player::find($data['player_id'])
            : Player::create([
                'name' => $data['name'],
                'birthdate' => $data['birthdate'] ?? null,
                'position' => $data['position'] ?? null,
            ]);

        if ($team->players()->whereKey($player->id)->exists()) {
            return response()->json(['message' => 'Player is already assigned to this team.'], 422);
        }

        if ($team->players()->wherePivot('jersey_number', $data['jersey_number'])->exists()) {
            return response()->json(['message' => 'Jersey number is already used by this team.'], 422);
        }

        $team->players()->attach($player->id, ['jersey_number' => $data['jersey_number']]);

        return response()->json($team->fresh('players'), 201);
    }

    public function removePlayer(Request $request, string $team, string $player)
    {
        $team = $this->teamForUser($request, $team);
        if (! $team) {
            return $this->notFound('Team');
        }

        $team->players()->detach($player);

        return response()->noContent();
    }
}
