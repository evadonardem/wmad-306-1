<?php

namespace App\Http\Controllers;

use App\Models\League;
use App\Models\Season;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SeasonController extends Controller
{
    public function index(Request $request, League $league)
    {
        if ($league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $seasons = $league->seasons()->with('teams')->get();
        return response()->json($seasons);
    }

    public function store(Request $request, League $league)
    {
        if ($league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'start_date' => 'required|date|before:end_date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'sometimes|in:active,done',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $season = $league->seasons()->create($request->all());

        return response()->json($season, 201);
    }

    public function show(Request $request, Season $season)
    {
        if ($season->league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $season->load(['teams.players', 'games.homeTeam', 'games.awayTeam', 'games.gameResult']);
        return response()->json($season);
    }

    public function update(Request $request, Season $season)
    {
        if ($season->league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|required|date|before:end_date',
            'end_date' => 'sometimes|required|date|after:start_date',
            'status' => 'sometimes|in:active,done',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $season->update($request->all());

        return response()->json($season);
    }

    public function destroy(Request $request, Season $season)
    {
        if ($season->league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $season->delete();

        return response()->json(['message' => 'Season deleted successfully']);
    }
}