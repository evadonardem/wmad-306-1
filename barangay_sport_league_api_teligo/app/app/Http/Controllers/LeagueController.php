<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LeagueController extends Controller
{
    public function index(Request $request)
    {
        $leagues = $request->user()->leagues()->get();
        return response()->json($leagues);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'sport'       => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $league = $request->user()->leagues()->create($request->only('name', 'sport', 'description'));

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

        $request->validate([
            'name'        => 'sometimes|string|max:255',
            'sport'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $league->update($request->only('name', 'sport', 'description'));

        return response()->json($league);
    }

    public function destroy(Request $request, $id)
    {
        $league = $request->user()->leagues()->findOrFail($id);
        $league->delete();

        return response()->json(['message' => 'League deleted']);
    }
}