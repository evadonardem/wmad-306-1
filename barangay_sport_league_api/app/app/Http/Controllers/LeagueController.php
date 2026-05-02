<?php

namespace App\Http\Controllers;

use App\Models\League;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LeagueController extends Controller
{
    public function index(Request $request)
    {
        $leagues = $request->user()->leagues()->with('seasons')->get();
        return response()->json($leagues);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'sport' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $league = $request->user()->leagues()->create($request->all());

        return response()->json($league, 201);
    }

    public function show(Request $request, League $league)
    {
        if ($league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $league->load(['seasons.teams', 'seasons.games']);
        return response()->json($league);
    }

    public function update(Request $request, League $league)
    {
        if ($league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'sport' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $league->update($request->all());

        return response()->json($league);
    }

    public function destroy(Request $request, League $league)
    {
        if ($league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $league->delete();

        return response()->json(['message' => 'League deleted successfully']);
    }
}
