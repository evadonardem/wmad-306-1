<?php

namespace App\Http\Controllers;

use App\Models\Season;
use App\Models\Game;
use App\Models\GameResult;
use App\Models\PlayerStat;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index($seasonId)
    {
        $season = Season::findOrFail($seasonId);

        return response()->json(
            $season->games()
                ->with('homeTeam', 'awayTeam')
                ->get()
        );
    }

    public function store(Request $request, $seasonId)
    {
        $season = Season::findOrFail($seasonId);

        $validated = $request->validate([
            'home_team_id' => 'required|exists:teams,id',
            'away_team_id' => 'required|exists:teams,id',
            'scheduled_at' => 'required|date_format:Y-m-d H:i:s',
            'venue' => 'nullable|string|max:255',
        ]);

        // Check if home_team_id belongs to this season
        $homeTeam = $season->teams()->find($validated['home_team_id']);
        if (!$homeTeam) {
            return response()->json(['message' => 'Home team does not belong to this season'], 422);
        }

        // Check if away_team_id belongs to this season
        $awayTeam = $season->teams()->find($validated['away_team_id']);
        if (!$awayTeam) {
            return response()->json(['message' => 'Away team does not belong to this season'], 422);
        }

        // Check if home_team_id equals away_team_id
        if ($validated['home_team_id'] === $validated['away_team_id']) {
            return response()->json(['message' => 'Home team and away team must be different'], 422);
        }

        // Check for duplicate matchup (both orders)
        $existingMatchup = $season->games()
            ->where(function ($q) use ($validated) {
                $q->where('home_team_id', $validated['home_team_id'])
                  ->where('away_team_id', $validated['away_team_id']);
            })
            ->orWhere(function ($q) use ($validated) {
                $q->where('home_team_id', $validated['away_team_id'])
                  ->where('away_team_id', $validated['home_team_id']);
            })
            ->exists();

        if ($existingMatchup) {
            return response()->json(['message' => 'This matchup already exists in this season'], 422);
        }

        // Check if either team already has a game on the same date
        $dateConflict = $season->games()
            ->where(function ($q) use ($validated) {
                $q->whereDate('scheduled_at', '=', \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $validated['scheduled_at'])->toDateString());
                $q->where(function ($subQ) use ($validated) {
                    $subQ->where('home_team_id', $validated['home_team_id'])
                         ->orWhere('away_team_id', $validated['home_team_id'])
                         ->orWhere('home_team_id', $validated['away_team_id'])
                         ->orWhere('away_team_id', $validated['away_team_id']);
                });
            })
            ->exists();

        if ($dateConflict) {
            return response()->json(['message' => 'One or both teams already have a game scheduled on this date'], 422);
        }

        $game = $season->games()->create([
            'home_team_id' => $validated['home_team_id'],
            'away_team_id' => $validated['away_team_id'],
            'scheduled_at' => $validated['scheduled_at'],
            'venue' => $validated['venue'] ?? null,
            'status' => 'scheduled',
        ]);

        return response()->json($game, 201);
    }

    public function show($id)
    {
        $game = Game::with('result', 'result.playerStats')->findOrFail($id);

        return response()->json($game);
    }

    public function submitResult(Request $request, $id)
    {
        $game = Game::findOrFail($id);

        $validated = $request->validate([
            'home_score' => 'required|integer|min:0',
            'away_score' => 'required|integer|min:0',
        ]);

        $result = GameResult::create([
            'game_id' => $game->id,
            'home_score' => $validated['home_score'],
            'away_score' => $validated['away_score'],
        ]);

        $game->update(['status' => 'done']);

        return response()->json($game->load('result'));
    }

    public function submitStats(Request $request, $id)
    {
        $game = Game::findOrFail($id);

        if ($game->status !== 'done') {
            return response()->json(['message' => 'Game must be completed before submitting stats'], 422);
        }

        $validated = $request->validate([
            'stats' => 'required|array',
            'stats.*.player_id' => 'required|exists:players,id',
            'stats.*.points' => 'required|integer|min:0',
            'stats.*.assists' => 'required|integer|min:0',
            'stats.*.rebounds' => 'required|integer|min:0',
            'stats.*.fouls' => 'required|integer|min:0',
        ]);

        $result = $game->result;
        if (!$result) {
            return response()->json(['message' => 'Game result not found'], 404);
        }

        foreach ($validated['stats'] as $stat) {
            PlayerStat::create([
                'game_result_id' => $result->id,
                'player_id' => $stat['player_id'],
                'points' => $stat['points'],
                'assists' => $stat['assists'],
                'rebounds' => $stat['rebounds'],
                'fouls' => $stat['fouls'],
            ]);
        }

        return response()->json(['message' => 'Player stats submitted successfully']);
    }
}
