<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameResult;
use App\Models\PlayerStat;
use App\Models\League;
use App\Models\Season;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    public function index(Request $request, Season $season)
    {
        if ($season->league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $games = $season->games()
            ->with(['homeTeam', 'awayTeam', 'gameResult'])
            ->orderBy('scheduled_at')
            ->get();

        return response()->json($games);
    }

    public function store(Request $request, Season $season)
    {
        if ($season->league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'home_team_id' => 'required|exists:teams,id',
            'away_team_id' => 'required|exists:teams,id|different:home_team_id',
            'scheduled_at' => 'required|date|after:now',
            'venue' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $homeTeam = Team::find($request->home_team_id);
        $awayTeam = Team::find($request->away_team_id);

        if ($homeTeam->season_id !== $season->id || $awayTeam->season_id !== $season->id) {
            return response()->json(['message' => 'Teams must belong to this season'], 422);
        }

        // Exercise 2: Additional validation rules

        // Check if the same matchup already exists in the season (order-independent)
        $existingMatchup = $season->games()
            ->where(function($query) use ($request) {
                $query->where(function($subQuery) use ($request) {
                    $subQuery->where('home_team_id', $request->home_team_id)
                           ->where('away_team_id', $request->away_team_id);
                })
                ->orWhere(function($subQuery) use ($request) {
                    $subQuery->where('home_team_id', $request->away_team_id)
                           ->where('away_team_id', $request->home_team_id);
                });
            })
            ->exists();

        if ($existingMatchup) {
            return response()->json([
                'message' => 'A game between these two teams already exists in this season'
            ], 422);
        }

        // Check if either team already has a game scheduled on the same date
        $scheduledDate = date('Y-m-d', strtotime($request->scheduled_at));
        $conflictingGame = $season->games()
            ->whereDate('scheduled_at', $scheduledDate)
            ->where(function($query) use ($request) {
                $query->where('home_team_id', $request->home_team_id)
                      ->orWhere('away_team_id', $request->home_team_id)
                      ->orWhere('home_team_id', $request->away_team_id)
                      ->orWhere('away_team_id', $request->away_team_id);
            })
            ->exists();

        if ($conflictingGame) {
            return response()->json([
                'message' => 'One or both teams already have a game scheduled on this date'
            ], 422);
        }

        $game = $season->games()->create($request->all());
        $game->load(['homeTeam', 'awayTeam']);

        return response()->json($game, 201);
    }

    public function show(Request $request, Game $game)
    {
        if ($game->season->league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $game->load(['homeTeam.players', 'awayTeam.players', 'gameResult.playerStats.player']);
        return response()->json($game);
    }

    public function submitResult(Request $request, Game $game)
    {
        if ($game->season->league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($game->status === 'done') {
            return response()->json(['message' => 'Game already completed'], 422);
        }

        $validator = Validator::make($request->all(), [
            'home_score' => 'required|integer|min:0',
            'away_score' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request, $game) {
            $gameResult = GameResult::create([
                'game_id' => $game->id,
                'home_score' => $request->home_score,
                'away_score' => $request->away_score,
            ]);

            $game->update(['status' => 'done']);

            $game->load(['homeTeam', 'awayTeam', 'gameResult']);

            return response()->json($game);
        });
    }

    public function submitStats(Request $request, Game $game)
    {
        if ($game->season->league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($game->status !== 'done') {
            return response()->json(['message' => 'Game must be completed before submitting stats'], 422);
        }

        $validator = Validator::make($request->all(), [
            'player_stats' => 'required|array',
            'player_stats.*.player_id' => 'required|exists:players,id',
            'player_stats.*.points' => 'required|integer|min:0',
            'player_stats.*.assists' => 'required|integer|min:0',
            'player_stats.*.rebounds' => 'required|integer|min:0',
            'player_stats.*.fouls' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request, $game) {
            $gameResult = $game->gameResult;

            // Clear existing stats for this game
            $gameResult->playerStats()->delete();

            foreach ($request->player_stats as $stat) {
                PlayerStat::create([
                    'game_result_id' => $gameResult->id,
                    'player_id' => $stat['player_id'],
                    'points' => $stat['points'],
                    'assists' => $stat['assists'],
                    'rebounds' => $stat['rebounds'],
                    'fouls' => $stat['fouls'],
                ]);
            }

            $game->load(['homeTeam', 'awayTeam', 'gameResult.playerStats.player']);

            return response()->json($game);
        });
    }
}
