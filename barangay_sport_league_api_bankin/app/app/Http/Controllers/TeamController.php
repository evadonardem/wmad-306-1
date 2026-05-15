<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\Season;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    // GET /api/seasons/{id}/teams - List teams in a season
    public function index($seasonId)
    {
        $season = Season::findOrFail($seasonId);
        return response()->json($season->teams);
    }

    // POST /api/seasons/{id}/teams - Register a team to a season
    public function store(Request $request, $seasonId)
    {
        $season = Season::findOrFail($seasonId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'coach' => 'required|string|max:255'
        ]);

        $team = $season->teams()->create($validated);

        return response()->json($team, 201);
    }

    // GET /api/teams/{id} - Show team with its players (eager loading the pivot data!)
    public function show($id)
    {
        $team = Team::with('players')->findOrFail($id);
        return response()->json($team);
    }

    // PUT /api/teams/{id} - Update team information
    public function update(Request $request, $id)
    {
        $team = Team::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'coach' => 'sometimes|required|string|max:255'
        ]);

        $team->update($validated);

        return response()->json($team);
    }

    // POST /api/teams/{id}/players - Add player to team with jersey number
    public function addPlayer(Request $request, $id)
    {
        $team = Team::findOrFail($id);

        $validated = $request->validate([
            'player_id' => 'required|exists:players,id',
            'jersey_number' => 'required|integer|min:0|max:99'
        ]);

        // Attach the player to the team and insert the jersey number into the pivot table
        $team->players()->attach($validated['player_id'], ['jersey_number' => $validated['jersey_number']]);

        return response()->json(['message' => 'Player added to team successfully']);
    }

    // DELETE /api/teams/{id}/players/{playerId} - Remove player from team
    public function removePlayer($id, $playerId)
    {
        $team = Team::findOrFail($id);

        // Detach removes the record from the player_team pivot table
        $team->players()->detach($playerId);

        return response()->json(['message' => 'Player removed from team successfully']);
    }
}
