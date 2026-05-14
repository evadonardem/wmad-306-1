<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Season;
use App\Models\Team;

class TeamController extends Controller
{
    // GET teams of a season
    public function index($seasonId)
    {
        $season = Season::find($seasonId);

        if (!$season) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Success',
            'data' => $season->teams,
        ]);
    }

    // CREATE team
    public function store(Request $request, $seasonId)
    {
        $season = Season::find($seasonId);

        if (!$season) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        $team = $season->teams()->create([
            'name' => $request->name,
            'coach' => $request->coach,
        ]);

        return response()->json([
            'message' => 'Success',
            'data' => $team,
        ], 201);
    }

    // SHOW team with players
    public function show($id)
    {
        $team = Team::with('players')->find($id);

        if (!$team) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Success',
            'data' => $team,
        ]);
    }

    // UPDATE team
    public function update(Request $request, $id)
    {
        $team = Team::find($id);

        if (!$team) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        $team->update($request->only(['name', 'coach']));

        return response()->json([
            'message' => 'Success',
            'data' => $team,
        ]);
    }

    // ADD player to team (pivot)
    public function addPlayer(Request $request, $id)
    {
        $request->validate([
            'player_id' => 'required|exists:players,id',
            'jersey_number' => 'required|integer|min:0'
        ]);

        $team = Team::find($id);

        if (!$team) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        $team->players()->attach($request->player_id, [
            'jersey_number' => $request->jersey_number
        ]);

        return response()->json([
            'message' => 'Success',
            'data' => $team,
        ]);
    }

    // REMOVE player
    public function removePlayer($id, $playerId)
    {
        $team = Team::find($id);

        if (!$team) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        $team->players()->detach($playerId);

        return response()->json([
            'message' => 'Success',
            'data' => $team,
        ]);
    }
}