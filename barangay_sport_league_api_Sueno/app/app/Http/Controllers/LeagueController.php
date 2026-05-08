<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\League;

class LeagueController extends Controller
{
    // 🔥 GET ALL LEAGUES
    public function index(Request $request)
    {
        return response()->json([
            'message' => 'Success',
            'data' => $request->user()->leagues,
        ]);
    }

    // 🔥 CREATE LEAGUE
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'sport' => 'required',
            'description' => 'nullable',
        ]);

        $league = $request->user()->leagues()->create($validated);

        return response()->json([
            'message' => 'Success',
            'data' => $league,
        ], 201);
    }

    // 🔥 SHOW ONE LEAGUE
    public function show(Request $request, $id)
    {
        $league = $request->user()->leagues()->find($id);

        if (!$league) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Success',
            'data' => $league,
        ]);
    }

    // 🔥 UPDATE LEAGUE
    public function update(Request $request, $id)
    {
        $league = $request->user()->leagues()->find($id);

        if (!$league) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        $league->update($request->only(['name', 'sport', 'description']));

        return response()->json([
            'message' => 'Success',
            'data' => $league,
        ]);
    }

    // 🔥 DELETE LEAGUE
    public function destroy(Request $request, $id)
    {
        $league = $request->user()->leagues()->find($id);

        if (!$league) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        $league->delete();

        return response()->json([
            'message' => 'Success',
            'data' => $league,
        ]);
    }
}