<?php

namespace App\Http\Controllers\Api;

use App\Models\Season;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;

class GameController extends Controller
{
    /**
     * Display all games for a season
     */
    public function index(Request $request, Season $season): Response
    {
        // Verify user owns the league
        $this->authorize('view', $season->league);

        $games = $season->games()
            ->with('homeTeam', 'awayTeam', 'result', 'playerStats')
            ->orderBy('scheduled_at')
            ->get();

        return response([
            'data' => $games,
        ]);
    }

    /**
     * Store a newly created game
     */
    public function store(Request $request, Season $season): Response
    {
        $this->authorize('update', $season->league);

        $validated = $request->validate([
            'home_team_id' => 'required|exists:teams,id',
            'away_team_id' => 'required|exists:teams,id|different:home_team_id',
            'scheduled_at' => 'required|date_format:Y-m-d H:i:s|after:now',
            'location' => 'nullable|string|max:255',
        ]);

        // Verify both teams are in this season
        $homeTeamInSeason = $season->teams()->where('teams.id', $validated['home_team_id'])->exists();
        $awayTeamInSeason = $season->teams()->where('teams.id', $validated['away_team_id'])->exists();

        if (!$homeTeamInSeason || !$awayTeamInSeason) {
            return response(['message' => 'One or both teams are not in this season'], 422);
        }

        $game = $season->games()->create($validated);

        return response([
            'data' => $game->load('homeTeam', 'awayTeam'),
            'message' => 'Game scheduled successfully',
        ], 201);
    }

    /**
     * Display a specific game
     */
    public function show(Request $request, Season $season, Game $game): Response
    {
        $this->authorize('view', $season->league);

        if ($game->season_id !== $season->id) {
            return response(['message' => 'Game not found'], 404);
        }

        return response([
            'data' => $game->load('homeTeam', 'awayTeam', 'result', 'playerStats.player'),
        ]);
    }

    /**
     * Update a game
     */
    public function update(Request $request, Season $season, Game $game): Response
    {
        $this->authorize('update', $season->league);

        if ($game->season_id !== $season->id) {
            return response(['message' => 'Game not found'], 404);
        }

        $validated = $request->validate([
            'scheduled_at' => 'sometimes|date_format:Y-m-d H:i:s',
            'location' => 'nullable|string|max:255',
            'status' => 'sometimes|in:scheduled,ongoing,completed,cancelled',
        ]);

        $game->update($validated);

        return response([
            'data' => $game,
            'message' => 'Game updated successfully',
        ]);
    }

    /**
     * Delete a game
     */
    public function destroy(Request $request, Season $season, Game $game): Response
    {
        $this->authorize('delete', $season->league);

        if ($game->season_id !== $season->id) {
            return response(['message' => 'Game not found'], 404);
        }

        $game->delete();

        return response([
            'message' => 'Game deleted successfully',
        ]);
    }
}
