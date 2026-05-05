<?php

namespace App\Http\Controllers;

use App\Models\Season;
use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index($seasonId)
    {
        $season = Season::findOrFail($seasonId);

        return response()->json($season->teams()->get());
    }

    public function store(Request $request, $seasonId)
    {
        $season = Season::findOrFail($seasonId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'coach' => 'nullable|string|max:255',
        ]);

        $team = $season->teams()->create($validated);

        return response()->json($team, 201);
    }

    public function show($id)
    {
        $team = Team::with('players')->findOrFail($id);

        return response()->json($team);
    }

    public function update(Request $request, $id)
    {
        $team = Team::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'coach' => 'nullable|string|max:255',
        ]);

        $team->update($validated);

        return response()->json($team);
    }

    public function addPlayer(Request $request, $teamId)
    {
        $team = Team::findOrFail($teamId);

        $validated = $request->validate([
            'player_id' => 'required|exists:players,id',
            'jersey_number' => 'required|integer',
        ]);

        $team->players()->attach($validated['player_id'], [
            'jersey_number' => $validated['jersey_number'],
        ]);

        return response()->json(['message' => 'Player added to team']);
    }

    public function removePlayer($teamId, $playerId)
    {
        $team = Team::findOrFail($teamId);
        $team->players()->detach($playerId);

        return response()->json(['message' => 'Player removed from team']);
    }
}
