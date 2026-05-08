<?php

namespace App\Http\Controllers\Api;

use App\Models\League;
use App\Models\Season;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;

class SeasonController extends Controller
{
    /**
     * Display all seasons for a league
     */
    public function index(Request $request, League $league): Response
    {
        $this->authorize('view', $league);

        $seasons = $league->seasons()->with('teams', 'games')->get();

        return response([
            'data' => $seasons,
        ]);
    }

    /**
     * Store a newly created season
     */
    public function store(Request $request, League $league): Response
    {
        $this->authorize('update', $league);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'year' => 'required|integer|min:2000|max:' . date('Y') + 10,
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'sometimes|in:upcoming,active,completed',
        ]);

        $season = $league->seasons()->create($validated);

        return response([
            'data' => $season,
            'message' => 'Season created successfully',
        ], 201);
    }

    /**
     * Display a specific season
     */
    public function show(Request $request, League $league, Season $season): Response
    {
        $this->authorize('view', $league);

        if ($season->league_id !== $league->id) {
            return response(['message' => 'Season not found'], 404);
        }

        return response([
            'data' => $season->load('teams', 'games.homeTeam', 'games.awayTeam'),
        ]);
    }

    /**
     * Update a season
     */
    public function update(Request $request, League $league, Season $season): Response
    {
        $this->authorize('update', $league);

        if ($season->league_id !== $league->id) {
            return response(['message' => 'Season not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'year' => 'sometimes|integer|min:2000',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'status' => 'sometimes|in:upcoming,active,completed',
        ]);

        $season->update($validated);

        return response([
            'data' => $season,
            'message' => 'Season updated successfully',
        ]);
    }

    /**
     * Delete a season
     */
    public function destroy(Request $request, League $league, Season $season): Response
    {
        $this->authorize('delete', $league);

        if ($season->league_id !== $league->id) {
            return response(['message' => 'Season not found'], 404);
        }

        $season->delete();

        return response([
            'message' => 'Season deleted successfully',
        ]);
    }

    /**
     * Add a team to a season
     */
    public function addTeam(Request $request, League $league, Season $season): Response
    {
        $this->authorize('update', $league);

        if ($season->league_id !== $league->id) {
            return response(['message' => 'Season not found'], 404);
        }

        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
        ]);

        $season->teams()->attach($validated['team_id']);

        return response([
            'message' => 'Team added to season successfully',
            'data' => $season->load('teams'),
        ]);
    }
}
