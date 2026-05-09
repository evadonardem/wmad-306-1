<?php

namespace App\Http\Controllers;

use App\Models\League;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LeagueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $leagues = $request->user()->leagues()->with('seasons')->get();
        return response()->json($leagues);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'sport' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $league = $request->user()->leagues()->create($request->all());
        $league->load('seasons');

        return response()->json($league, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, League $league)
    {
        // Ensure the league belongs to the authenticated user
        $league = $request->user()->leagues()->findOrFail($league->id);
        $league->load('seasons.teams');
        
        return response()->json($league);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, League $league)
    {
        // Ensure the league belongs to the authenticated user
        $league = $request->user()->leagues()->findOrFail($league->id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'sport' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $league->update($request->all());
        $league->load('seasons');

        return response()->json($league);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, League $league)
    {
        // Ensure the league belongs to the authenticated user
        $league = $request->user()->leagues()->findOrFail($league->id);
        
        $league->delete();

        return response()->json(['message' => 'League deleted successfully']);
    }
}
