<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameResult;
use App\Models\PlayerStat;
use App\Models\Season;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index($seasonId)
    {
        $season = Season::findOrFail($seasonId);
        return response()->json($season->games()->with(['homeTeam', 'awayTeam'])->get());
    }

    public function store(Request $request, $seasonId)
    {
        $season = Season::findOrFail($seasonId);

        $request->validate([
            'home_team_id' => 'required|exists:teams,id',
            'away_team_id' => 'required|exists:teams,id',
            'scheduled_at' => 'required|date',
            'venue'        => 'required|string|max:255',
        ]);

        $homeId = $request->home_team_id;
        $awayId = $request->away_team_id;
        $date   = date('Y-m-d', strtotime($request->scheduled_at));

        // Teams cannot be the same
        if ($homeId === $awayId) {
            return response()->json([
                'message' => 'A team cannot play against itself.'
            ], 422);
        }

        // Both teams must belong to this season
        $teamIds = $season->teams()->pluck('id')->toArray();
        if (!in_array($homeId, $teamIds) || !in_array($awayId, $teamIds)) {
            return response()->json([
                'message' => 'Both teams must belong to this season.'
            ], 422);
        }

        // Check if the same matchup already exists (order-independent)
        $matchupExists = $season->games()
            ->where(function ($q) use ($homeId, $awayId) {
                $q->where(fn($q) => $q->where('home_team_id', $homeId)->where('away_team_id', $awayId))
                  ->orWhere(fn($q) => $q->where('home_team_id', $awayId)->where('away_team_id', $homeId));
            })->exists();

        if ($matchupExists) {
            return response()->json([
                'message' => "A game between these two teams already exists in this season."
            ], 422);
        }

        // Check if either team already has a game on the same date
        $dateConflict = $season->games()
            ->whereDate('scheduled_at', $date)
            ->where(fn($q) => $q
                ->whereIn('home_team_id', [$homeId, $awayId])
                ->orWhereIn('away_team_id', [$homeId, $awayId])
            )->exists();

        if ($dateConflict) {
            return response()->json([
                'message' => "One or both teams already have a game scheduled on {$date}."
            ], 422);
        }

        $game = $season->games()->create([
            'home_team_id' => $homeId,
            'away_team_id' => $awayId,
            'scheduled_at' => $request->scheduled_at,
            'venue'        => $request->venue,
            'status'       => 'scheduled',
        ]);

        return response()->json($game->load(['homeTeam', 'awayTeam']), 201);
    }

    public function show($id)
    {
        $game = Game::with(['homeTeam', 'awayTeam', 'result.playerStats.player'])->findOrFail($id);
        return response()->json($game);
    }

    public function submitResult(Request $request, $id)
    {
        $game = Game::findOrFail($id);

        $request->validate([
            'home_score' => 'required|integer|min:0',
            'away_score' => 'required|integer|min:0',
        ]);

        $result = GameResult::create([
            'game_id'    => $game->id,
            'home_score' => $request->home_score,
            'away_score' => $request->away_score,
        ]);

        $game->update(['status' => 'done']);

        return response()->json($result, 201);
    }

    public function submitStats(Request $request, $id)
    {
        $game = Game::findOrFail($id);

        if ($game->status !== 'done') {
            return response()->json([
                'message' => 'Stats can only be submitted for completed games.'
            ], 422);
        }

        $request->validate([
            'stats'             => 'required|array',
            'stats.*.player_id' => 'required|exists:players,id',
            'stats.*.points'    => 'required|integer|min:0',
            'stats.*.assists'   => 'required|integer|min:0',
            'stats.*.rebounds'  => 'required|integer|min:0',
            'stats.*.fouls'     => 'required|integer|min:0',
        ]);

        $gameResultId = $game->result->id;

        $statsToInsert = collect($request->stats)->map(fn($stat) => [
            'game_result_id' => $gameResultId,
            'player_id'      => $stat['player_id'],
            'points'         => $stat['points'],
            'assists'        => $stat['assists'],
            'rebounds'       => $stat['rebounds'],
            'fouls'          => $stat['fouls'],
            'created_at'     => now(),
            'updated_at'     => now(),
        ])->toArray();

        PlayerStat::insert($statsToInsert);

        return response()->json(['message' => 'Stats submitted successfully'], 201);
    }
}