<?php

namespace App\Http\Controllers;

use App\Models\League;
use App\Models\Season;
use Illuminate\Http\Request;

class SeasonController extends Controller
{
    public function index(Request $request, $leagueId)
    {
        $league = $request->user()->leagues()->findOrFail($leagueId);

        return response()->json($league->seasons()->get());
    }

    public function store(Request $request, $leagueId)
    {
        $league = $request->user()->leagues()->findOrFail($leagueId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'status' => 'sometimes|in:active,done',
        ]);

        $season = $league->seasons()->create($validated);

        return response()->json($season, 201);
    }

    public function show($id)
    {
        $season = Season::with('teams', 'games')->findOrFail($id);

        return response()->json($season);
    }

    public function update(Request $request, $id)
    {
        $season = Season::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date',
            'status' => 'sometimes|in:active,done',
        ]);

        $season->update($validated);

        return response()->json($season);
    }
}
