<?php

namespace App\Http\Controllers;

use App\Models\League;
use App\Models\Season;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SeasonController extends Controller
{
    /**
     * Display a listing of seasons for a specific league.
     */
    public function index(Request $request, League $league)
    {
        // Ensure the league belongs to the authenticated user
        $league = $request->user()->leagues()->findOrFail($league->id);
        $seasons = $league->seasons()->with('teams')->get();
        
        return response()->json($seasons);
    }

    /**
     * Store a newly created season in storage.
     */
    public function store(Request $request, League $league)
    {
        // Ensure the league belongs to the authenticated user
        $league = $request->user()->leagues()->findOrFail($league->id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'sometimes|in:active,done',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $season = $league->seasons()->create($request->all());
        $season->load('teams');

        return response()->json($season, 201);
    }

    public function storeDirect(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'league_id' => 'required|integer',
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'sometimes|in:active,done',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $league = $request->user()->leagues()->findOrFail($request->input('league_id'));

        $season = $league->seasons()->create([
            'name' => $request->input('name'),
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
            'status' => $request->input('status', 'active'),
        ]);

        $season->load('teams');

        return response()->json($season, 201);
    }

    /**
     * Display the specified season.
     */
    public function show(Request $request, Season $season)
    {
        // Ensure the season belongs to a league owned by the authenticated user
        $season = Season::whereHas('league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($season->id);

        $season->load(['teams.players', 'games.homeTeam', 'games.awayTeam']);
        
        return response()->json($season);
    }

    /**
     * Update the specified season in storage.
     */
    public function update(Request $request, Season $season)
    {
        // Ensure the season belongs to a league owned by the authenticated user
        $season = Season::whereHas('league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($season->id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after:start_date',
            'status' => 'sometimes|in:active,done',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $season->update($request->all());
        $season->load('teams');

        return response()->json($season);
    }

    /**
     * Remove the specified season from storage.
     */
    public function destroy(Request $request, Season $season)
    {
        // Ensure the season belongs to a league owned by the authenticated user
        $season = Season::whereHas('league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($season->id);
        
        $season->delete();

        return response()->json(['message' => 'Season deleted successfully']);
    }
}
