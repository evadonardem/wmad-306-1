<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\Season;

class GameController extends Controller
{
    // GET games of a season
    public function index($seasonId)
    {
        $season = Season::find($seasonId);

        if (!$season) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Success',
            'data' => Game::where('season_id', $seasonId)
                ->with(['homeTeam', 'awayTeam'])
                ->get(),
        ]);
    }

    public function store(\App\Http\Requests\StoreGameRequest $request, $seasonId)
    {
        $season = \App\Models\Season::find($seasonId);

        if (!$season) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        // 🔥 Extra validation: same season check
        $teamA = \App\Models\Team::find($request->team_a_id);
        $teamB = \App\Models\Team::find($request->team_b_id);

        if (!$teamA || !$teamB) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        $teamAId = $teamA->id;
        $teamBId = $teamB->id;

        if ($teamA->season_id != $seasonId || $teamB->season_id != $seasonId) {
            return response()->json([
                'message' => 'Teams must belong to the same season'
            ], 422);
        }

        // ❌ duplicate matchup
        $exists = \App\Models\Game::where('season_id', $seasonId)
            ->where(function ($q) use ($teamAId, $teamBId) {
                $q->where([
                    ['team_a_id', $teamAId],
                    ['team_b_id', $teamBId]
                ])->orWhere([
                    ['team_a_id', $teamBId],
                    ['team_b_id', $teamAId]
                ]);
            })
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Game already exists between these teams'
            ], 422);
        }

        // ❌ same date conflict
        $conflict = \App\Models\Game::where('season_id', $seasonId)
            ->where('game_date', $request->game_date)
            ->where(function ($q) use ($request) {
                $q->where('team_a_id', $request->team_a_id)
                  ->orWhere('team_b_id', $request->team_a_id)
                  ->orWhere('team_a_id', $request->team_b_id)
                  ->orWhere('team_b_id', $request->team_b_id);
            })
            ->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'One of the teams already has a game on this date'
            ], 422);
        }

        $game = \App\Models\Game::create([
            'season_id' => $seasonId,
            'team_a_id' => $request->team_a_id,
            'team_b_id' => $request->team_b_id,
            'game_date' => $request->game_date,
        ]);

        return response()->json([
            'message' => 'Success',
            'data' => $game
        ], 201);
    }

    // RECORD RESULT
    public function result(Request $request, $id)
    {
        $game = Game::find($id);

        if (!$game) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        $game->update([
            'score_a' => $request->score_a,
            'score_b' => $request->score_b,
        ]);

        return response()->json([
            'message' => 'Success',
            'data' => $game,
        ]);
    }

    public function stats(Request $request, $gameId)
    {
        $game = \App\Models\Game::find($gameId);

        if (!$game) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        if ($game->score_a === null || $game->score_b === null) {
            return response()->json([
                'message' => 'Game must be finished before adding stats'
            ], 422);
        }

        if (!$request->players) {
            return response()->json([
                'message' => 'Players data is required'
            ], 422);
        }

        foreach ($request->players as $player) {
            \App\Models\PlayerStat::create([
                'game_id' => $gameId,
                'player_id' => $player['player_id'],
                'points' => $player['points'],
                'assists' => $player['assists'] ?? 0,
                'rebounds' => $player['rebounds'] ?? 0,
            ]);
        }

        return response()->json([
            'message' => 'Success',
            'data' => null,
        ]);
    }

    public function standings($seasonId)
    {
        $season = \App\Models\Season::find($seasonId);

        if (!$season) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        $games = \App\Models\Game::where('season_id', $seasonId)
            ->whereNotNull('score_a')
            ->whereNotNull('score_b')
            ->get();

        $standings = [];

        foreach ($games as $game) {

            // Team A
            if (!isset($standings[$game->team_a_id])) {
                $standings[$game->team_a_id] = ['wins' => 0, 'losses' => 0];
            }

            // Team B
            if (!isset($standings[$game->team_b_id])) {
                $standings[$game->team_b_id] = ['wins' => 0, 'losses' => 0];
            }

            if ($game->score_a > $game->score_b) {
                $standings[$game->team_a_id]['wins']++;
                $standings[$game->team_b_id]['losses']++;
            } else {
                $standings[$game->team_b_id]['wins']++;
                $standings[$game->team_a_id]['losses']++;
            }
        }

        return response()->json([
            'message' => 'Success',
            'data' => $standings,
        ]);
    }

    public function leaderboard($seasonId)
    {
        $players = \App\Models\PlayerStat::selectRaw('players.name, CAST(SUM(points) AS SIGNED) as total_points')
            ->join('games', 'player_stats.game_id', '=', 'games.id')
            ->join('players', 'player_stats.player_id', '=', 'players.id')
            ->where('games.season_id', $seasonId)
            ->groupBy('players.name')
            ->orderByDesc('total_points')
            ->take(10)
            ->get();

        return response()->json([
            'message' => 'Success',
            'data' => $players
        ]);
    }

    public function summary($seasonId)
    {
        $season = \App\Models\Season::find($seasonId);

        if (!$season) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        $games = \App\Models\Game::where('season_id', $seasonId)->get();

        if ($games->count() === 0) {
            return response()->json([
                'message' => 'No games found for this season'
            ], 404);
        }

        $played = $games->whereNotNull('score_a')->whereNotNull('score_b')->count();
        $scheduled = $games->count() - $played;

        $totalPoints = $games->sum(function ($game) {
            return ($game->score_a ?? 0) + ($game->score_b ?? 0);
        });

        // compute top scoring team
        $teamPoints = [];

        foreach ($games as $game) {
            $teamPoints[$game->team_a_id] = ($teamPoints[$game->team_a_id] ?? 0) + ($game->score_a ?? 0);
            $teamPoints[$game->team_b_id] = ($teamPoints[$game->team_b_id] ?? 0) + ($game->score_b ?? 0);
        }

        arsort($teamPoints);

        return response()->json([
            'message' => 'Success',
            'data' => [
            'total_games_played' => $played,
            'total_games_scheduled' => $scheduled,
            'top_scoring_team_id' => array_key_first($teamPoints),
            'total_points_scored' => $totalPoints,
            ],
        ]);
    }
}