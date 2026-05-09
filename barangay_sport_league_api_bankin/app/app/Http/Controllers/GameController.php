<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Season;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GameController extends Controller
{
    // GET /api/seasons/{id}/games - List all games in a season
    public function index($seasonId)
    {
        $season = Season::with('games')->findOrFail($seasonId);
        return response()->json($season->games);
    }

    // POST /api/seasons/{id}/games - Schedule a game
    public function store(Request $request, $seasonId)
    {
        $season = Season::findOrFail($seasonId);

        $validated = $request->validate([
            // Ensure the home team exists AND belongs to this specific season
            'home_team_id' => [
                'required',
                Rule::exists('teams', 'id')->where('season_id', $seasonId)
            ],
            // Ensure away team exists, belongs to this season, and is DIFFERENT from home team
            'away_team_id' => [
                'required',
                'different:home_team_id',
                Rule::exists('teams', 'id')->where('season_id', $seasonId)
            ],
            'scheduled_at' => 'required|date',
            'venue' => 'required|string|max:255'
        ]);

        // Create the game (status defaults to 'scheduled' per our database migration)
        $game = $season->games()->create($validated);

        return response()->json($game, 201);
    }

    // GET /api/games/{id} - Show game with result and stats
    public function show($id)
    {
        // We will eager load the result and player stats for later tasks!
        $game = Game::with(['homeTeam', 'awayTeam', 'result.playerStats'])->findOrFail($id);

        return response()->json($game);
    }

    // POST /api/games/{id}/result - Submit final score and mark game as done
    public function submitResult(Request $request, $id)
    {
        $game = Game::findOrFail($id);

        $validated = $request->validate([
            'home_score' => 'required|integer|min:0',
            'away_score' => 'required|integer|min:0'
        ]);

        // Create the game result
        $result = $game->result()->create($validated);

        // Update the game status to done
        $game->update(['status' => 'done']);

        return response()->json([
            'message' => 'Result submitted successfully',
            'game' => $game,
            'result' => $result
        ], 201);
    }

    // POST /api/games/{id}/stats - Submit individual player stats
    public function submitStats(Request $request, $id)
    {
        $game = Game::findOrFail($id);

        // Validation from Section 10: Must be 'done' to accept stats
        if ($game->status !== 'done') {
            return response()->json(['message' => 'Game must be marked as done before submitting stats'], 422);
        }

        // Validate that an array of stats was sent
        $validated = $request->validate([
            'stats' => 'required|array',
            'stats.*.player_id' => 'required|exists:players,id',
            'stats.*.points' => 'required|integer|min:0',
            'stats.*.assists' => 'required|integer|min:0',
            'stats.*.rebounds' => 'required|integer|min:0',
            'stats.*.fouls' => 'required|integer|min:0'
        ]);

        // Bulk insert the stats using the game result relationship
        $stats = $game->result->playerStats()->createMany($validated['stats']);

        return response()->json([
            'message' => 'Player stats submitted successfully',
            'stats' => $stats
        ], 201);
    }
}
