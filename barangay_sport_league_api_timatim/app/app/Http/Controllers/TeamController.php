<?php

namespace App\Http\Controllers;

use App\Models\Player;
use App\Models\Season;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TeamController extends Controller
{
    /**
     * Display a listing of teams for a specific season.
     */
    public function index(Request $request, Season $season)
    {
        // Ensure the season belongs to a league owned by the authenticated user
        $season = Season::whereHas('league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($season->id);

        $teams = $season->teams()->with('players')->get();
        
        return response()->json($teams);
    }

    /**
     * Store a newly created team in storage.
     */
    public function store(Request $request, Season $season)
    {
        // Ensure the season belongs to a league owned by the authenticated user
        $season = Season::whereHas('league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($season->id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'coach' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $team = $season->teams()->create($request->all());
        $team->load('players');

        return response()->json($team, 201);
    }

    /**
     * Display the specified team.
     */
    public function show(Request $request, Team $team)
    {
        // Ensure the team belongs to a season owned by the authenticated user
        $team = Team::whereHas('season.league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($team->id);

        $team->load('players');
        
        return response()->json($team);
    }

    /**
     * Update the specified team in storage.
     */
    public function update(Request $request, Team $team)
    {
        // Ensure the team belongs to a season owned by the authenticated user
        $team = Team::whereHas('season.league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($team->id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'coach' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $team->update($request->all());
        $team->load('players');

        return response()->json($team);
    }

    /**
     * Remove the specified team from storage.
     */
    public function destroy(Request $request, Team $team)
    {
        // Ensure the team belongs to a season owned by the authenticated user
        $team = Team::whereHas('season.league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($team->id);
        
        $team->delete();

        return response()->json(['message' => 'Team deleted successfully']);
    }

    /**
     * Add a player to a team with jersey number.
     */
    public function addPlayer(Request $request, Team $team)
    {
        // Ensure the team belongs to a season owned by the authenticated user
        $team = Team::whereHas('season.league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($team->id);

        $validator = Validator::make($request->all(), [
            'player_id' => 'required|exists:players,id',
            'jersey_number' => 'required|integer|min:1|max:99',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Check if player is already on the team
        if ($team->players()->where('player_id', $request->player_id)->exists()) {
            return response()->json(['message' => 'Player is already on this team'], 422);
        }

        $team->players()->attach($request->player_id, ['jersey_number' => $request->jersey_number]);
        $team->load('players');

        return response()->json($team, 201);
    }

    /**
     * Remove a player from a team.
     */
    public function removePlayer(Request $request, Team $team, Player $player)
    {
        // Ensure the team belongs to a season owned by the authenticated user
        $team = Team::whereHas('season.league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($team->id);

        // Check if player is on the team
        if (!$team->players()->where('player_id', $player->id)->exists()) {
            return response()->json(['message' => 'Player is not on this team'], 404);
        }

        $team->players()->detach($player->id);
        $team->load('players');

        return response()->json($team);
    }
}
