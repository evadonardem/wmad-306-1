<?php

namespace App\Http\Controllers;

use App\Models\Season;
use Illuminate\Http\Request;

class SeasonController extends Controller
{
    public function index(Request $request, $leagueId)
    {
        $league = \App\Models\League::find($leagueId);

        if (!$league) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Success',
            'data' => Season::where('league_id', $leagueId)->get(),
        ]);
    }

    public function store(Request $request, $leagueId)
    {
        $league = \App\Models\League::find($leagueId);

        if (!$league) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required',
            'description' => 'nullable',
        ]);

        $season = Season::create([
            'league_id' => $leagueId,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'message' => 'Success',
            'data' => $season,
        ], 201);
    }

    public function show(Request $request, $leagueId, $seasonId)
    {
        $league = \App\Models\League::find($leagueId);

        if (!$league) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        $season = Season::where('league_id', $leagueId)->find($seasonId);

        if (!$season) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Success',
            'data' => $season,
        ]);
    }

    public function update(Request $request, $leagueId, $seasonId)
    {
        $league = \App\Models\League::find($leagueId);

        if (!$league) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        $season = Season::where('league_id', $leagueId)->find($seasonId);

        if (!$season) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        $season->update($request->only(['name', 'description']));

        return response()->json([
            'message' => 'Success',
            'data' => $season,
        ]);
    }

    public function destroy(Request $request, $leagueId, $seasonId)
    {
        $league = \App\Models\League::find($leagueId);

        if (!$league) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        $season = Season::where('league_id', $leagueId)->find($seasonId);

        if (!$season) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        $season->delete();

        return response()->json([
            'message' => 'Success',
            'data' => $season,
        ]);
    }
}
