<?php

namespace App\Http\Controllers\Api;

use App\Models\League;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;

class LeagueController extends Controller
{
    /**
     * Display all leagues for the authenticated user
     */
    public function index(Request $request): Response
    {
        $leagues = $request->user()->leagues()->with('seasons')->get();

        return response([
            'data' => $leagues,
        ]);
    }

    /**
     * Store a newly created league
     */
    public function store(Request $request): Response
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
        ]);

        $league = $request->user()->leagues()->create($validated);

        return response([
            'data' => $league,
            'message' => 'League created successfully',
        ], 201);
    }

    /**
     * Display a specific league
     */
    public function show(Request $request, League $league): Response
    {
        $this->authorize('view', $league);

        return response([
            'data' => $league->load('seasons.teams', 'seasons.games'),
        ]);
    }

    /**
     * Update a league
     */
    public function update(Request $request, League $league): Response
    {
        $this->authorize('update', $league);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'location' => 'sometimes|string|max:255',
        ]);

        $league->update($validated);

        return response([
            'data' => $league,
            'message' => 'League updated successfully',
        ]);
    }

    /**
     * Delete a league
     */
    public function destroy(Request $request, League $league): Response
    {
        $this->authorize('delete', $league);

        $league->delete();

        return response([
            'message' => 'League deleted successfully',
        ]);
    }
}
