<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\Season;
use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TeamController extends Controller
{
    public function index(Request $request, Season $season)
    {
        if ($season->league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $teams = $season->teams()->with('players')->get();
        return response()->json($teams);
    }

    public function store(Request $request, Season $season)
    {
        if ($season->league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'coach' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $team = $season->teams()->create($request->all());

        return response()->json($team, 201);
    }

    public function show(Request $request, Team $team)
    {
        if ($team->season->league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $team->load(['players', 'homeGames.awayTeam', 'awayGames.homeTeam', 'homeGames.gameResult', 'awayGames.gameResult']);
        return response()->json($team);
    }

    public function update(Request $request, Team $team)
    {
        if ($team->season->league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'coach' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $team->update($request->all());

        return response()->json($team);
    }

    public function addPlayer(Request $request, Team $team)
    {
        if ($team->season->league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'player_id' => 'required|exists:players,id',
            'jersey_number' => 'required|integer|min:1|max:99',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($team->players()->where('player_id', $request->player_id)->exists()) {
            return response()->json(['message' => 'Player already on team'], 422);
        }

        if ($team->players()->wherePivot('jersey_number', $request->jersey_number)->exists()) {
            return response()->json(['message' => 'Jersey number already taken'], 422);
        }

        $team->players()->attach($request->player_id, ['jersey_number' => $request->jersey_number]);

        return response()->json(['message' => 'Player added to team successfully']);
    }

    public function removePlayer(Request $request, Team $team, Player $player)
    {
        if ($team->season->league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $team->players()->detach($player->id);

        return response()->json(['message' => 'Player removed from team successfully']);
    }
}
