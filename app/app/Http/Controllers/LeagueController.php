<?php

namespace App\Http\Controllers;

use App\Models\League;
use Illuminate\Http\Request;

class LeagueController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->leagues()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sport' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $league = $request->user()->leagues()->create($validated);

        return response()->json($league, 201);
    }

    public function show(Request $request, $id)
    {
        $league = $request->user()->leagues()->with('seasons')->findOrFail($id);

        return response()->json($league);
    }

    public function update(Request $request, $id)
    {
        $league = $request->user()->leagues()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'sport' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $league->update($validated);

        return response()->json($league);
    }

    public function destroy(Request $request, $id)
    {
        $league = $request->user()->leagues()->findOrFail($id);
        $league->delete();

        return response()->json(['message' => 'League deleted successfully']);
    }
}
