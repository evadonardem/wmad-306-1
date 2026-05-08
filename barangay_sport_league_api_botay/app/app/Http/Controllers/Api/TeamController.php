<?php

namespace App\Http\Controllers\Api;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;

class TeamController extends Controller
{
    /**
     * Display all teams for the authenticated user
     */
    public function index(Request $request): Response
    {
        $teams = $request->user()->teams()->with('players', 'seasons')->get();

        return response([
            'data' => $teams,
        ]);
    }

    /**
     * Store a newly created team
     */
    public function store(Request $request): Response
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:teams',
            'description' => 'nullable|string',
        ]);

        $team = $request->user()->teams()->create($validated);

        return response([
            'data' => $team,
            'message' => 'Team created successfully',
        ], 201);
    }

    /**
     * Display a specific team
     */
    public function show(Request $request, Team $team): Response
    {
        $this->authorize('view', $team);

        return response([
            'data' => $team->load('players', 'seasons', 'homeGames', 'awayGames'),
        ]);
    }

    /**
     * Update a team
     */
    public function update(Request $request, Team $team): Response
    {
        $this->authorize('update', $team);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:10|unique:teams,code,' . $team->id,
            'description' => 'nullable|string',
        ]);

        $team->update($validated);

        return response([
            'data' => $team,
            'message' => 'Team updated successfully',
        ]);
    }

    /**
     * Delete a team
     */
    public function destroy(Request $request, Team $team): Response
    {
        $this->authorize('delete', $team);

        $team->delete();

        return response([
            'message' => 'Team deleted successfully',
        ]);
    }
}
