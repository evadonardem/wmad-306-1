<?php

namespace App\Http\Controllers;

use App\Models\Season;
use Illuminate\Http\Request;

class SeasonController extends Controller
{
    public function index(Request $request, $leagueId)
    {
        $league = $request->user()->leagues()->findOrFail($leagueId);
        return response()->json($league->seasons);
    }

    public function store(Request $request, $leagueId)
    {
        $league = $request->user()->leagues()->findOrFail($leagueId);

        $request->validate([
            'name'       => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after:start_date',
            'status'     => 'in:active,done',
        ]);

        $season = $league->seasons()->create($request->only('name', 'start_date', 'end_date', 'status'));

        return response()->json($season, 201);
    }

    public function show(Request $request, $id)
    {
        $season = Season::with(['teams', 'games'])->findOrFail($id);
        return response()->json($season);
    }

    public function update(Request $request, $id)
    {
        $season = Season::findOrFail($id);

        $request->validate([
            'name'       => 'sometimes|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date'   => 'sometimes|date',
            'status'     => 'in:active,done',
        ]);

        $season->update($request->only('name', 'start_date', 'end_date', 'status'));

        return response()->json($season);
    }
}