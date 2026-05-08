<?php

namespace App\Http\Controllers\Api;

use App\Models\Season;
use App\Models\Game;
use App\Models\GameResult;
use App\Models\PlayerStats;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;

class GameResultController extends Controller
{
    /**
     * Store game result and player stats
     */
    public function store(Request $request, Season $season, Game $game): Response
    {
        $this->authorize('update', $season->league);

        if ($game->season_id !== $season->id) {
            return response(['message' => 'Game not found'], 404);
        }

        $validated = $request->validate([
            'home_team_score' => 'required|integer|min:0',
            'away_team_score' => 'required|integer|min:0',
            'player_stats' => 'nullable|array',
            'player_stats.*.player_id' => 'required_with:player_stats|exists:players,id',
            'player_stats.*.points' => 'nullable|integer|min:0',
            'player_stats.*.rebounds' => 'nullable|integer|min:0',
            'player_stats.*.assists' => 'nullable|integer|min:0',
            'player_stats.*.steals' => 'nullable|integer|min:0',
            'player_stats.*.blocks' => 'nullable|integer|min:0',
            'player_stats.*.fouls' => 'nullable|integer|min:0|max:6',
        ]);

        try {
            DB::beginTransaction();

            // Create or update game result
            $result = $game->result()->updateOrCreate(
                ['game_id' => $game->id],
                [
                    'home_team_score' => $validated['home_team_score'],
                    'away_team_score' => $validated['away_team_score'],
                ]
            );

            // Update game status
            $game->update(['status' => 'completed']);

            // Update team standings
            if ($validated['home_team_score'] > $validated['away_team_score']) {
                // Home team wins
                $season->teams()->updateExistingPivot($game->home_team_id, [
                    'wins' => DB::raw('wins + 1'),
                ]);
                $season->teams()->updateExistingPivot($game->away_team_id, [
                    'losses' => DB::raw('losses + 1'),
                ]);
            } elseif ($validated['away_team_score'] > $validated['home_team_score']) {
                // Away team wins
                $season->teams()->updateExistingPivot($game->away_team_id, [
                    'wins' => DB::raw('wins + 1'),
                ]);
                $season->teams()->updateExistingPivot($game->home_team_id, [
                    'losses' => DB::raw('losses + 1'),
                ]);
            }

            // Store player stats if provided
            if (!empty($validated['player_stats'])) {
                foreach ($validated['player_stats'] as $stats) {
                    PlayerStats::updateOrCreate(
                        [
                            'player_id' => $stats['player_id'],
                            'game_id' => $game->id,
                        ],
                        [
                            'points' => $stats['points'] ?? 0,
                            'rebounds' => $stats['rebounds'] ?? 0,
                            'assists' => $stats['assists'] ?? 0,
                            'steals' => $stats['steals'] ?? 0,
                            'blocks' => $stats['blocks'] ?? 0,
                            'fouls' => $stats['fouls'] ?? 0,
                        ]
                    );
                }
            }

            DB::commit();

            return response([
                'data' => $game->load('result', 'playerStats.player'),
                'message' => 'Game result recorded successfully',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response(['message' => 'Error recording game result: ' . $e->getMessage()], 422);
        }
    }

    /**
     * Display game result
     */
    public function show(Request $request, Season $season, Game $game): Response
    {
        $this->authorize('view', $season->league);

        if ($game->season_id !== $season->id) {
            return response(['message' => 'Game not found'], 404);
        }

        if (!$game->result) {
            return response(['message' => 'No result recorded for this game'], 404);
        }

        return response([
            'data' => [
                'game' => $game->load('homeTeam', 'awayTeam'),
                'result' => $game->result,
                'player_stats' => $game->playerStats()->with('player')->get(),
            ],
        ]);
    }
}
