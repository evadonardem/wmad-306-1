<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);
        $teams = $season->teams()->with('players')->latest()->get();

        return $this->success('Teams retrieved successfully.', $teams);
    }

    public function store(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'coach' => ['nullable', 'string', 'max:255'],
        ]);

        if ($season->teams()->where('name', $validated['name'])->exists()) {
            return $this->fail('A team with this name already exists in this season.');
        }

        $team = $season->teams()->create($validated);

        return $this->success('Team registered successfully.', $team, 201);
    }

    public function show(Request $request, string $team)
    {
        $team = $this->teamForUser($request, $team);
        $team->load(['season', 'players']);

        return $this->success('Team retrieved successfully.', $team);
    }

    public function update(Request $request, string $team)
    {
        $team = $this->teamForUser($request, $team);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'coach' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        if (array_key_exists('name', $validated)
            && $team->season->teams()->where('name', $validated['name'])->whereKeyNot($team->id)->exists()) {
            return $this->fail('A team with this name already exists in this season.');
        }

        $team->update($validated);

        return $this->success('Team updated successfully.', $team);
    }

    public function addPlayer(Request $request, string $team)
    {
        $team = $this->teamForUser($request, $team);

        $validated = $request->validate([
            'player_id' => ['nullable', 'integer', 'exists:players,id'],
            'name' => ['required_without:player_id', 'string', 'max:255'],
            'birthdate' => ['nullable', 'date'],
            'position' => ['nullable', 'string', 'max:100'],
            'jersey_number' => ['required', 'integer', 'min:0', 'max:999'],
        ]);

        $player = isset($validated['player_id'])
            ? Player::find($validated['player_id'])
            : Player::create([
                'name' => $validated['name'],
                'birthdate' => $validated['birthdate'] ?? null,
                'position' => $validated['position'] ?? null,
            ]);

        if ($team->players()->whereKey($player->id)->exists()) {
            return $this->fail('This player is already assigned to the team.');
        }

        if ($team->players()->wherePivot('jersey_number', $validated['jersey_number'])->exists()) {
            return $this->fail('This jersey number is already used by another player on the team.');
        }

        $team->players()->attach($player->id, [
            'jersey_number' => $validated['jersey_number'],
        ]);

        $team->load('players');

        return $this->success('Player added to team successfully.', $team, 201);
    }

    public function removePlayer(Request $request, string $team, string $player)
    {
        $team = $this->teamForUser($request, $team);
        $detached = $team->players()->detach($player);

        if ($detached === 0) {
            $this->notFound('Player assignment not found.');
        }

        return $this->success('Player removed from team successfully.');
    }
}
