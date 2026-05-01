<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class GameController extends Controller
{
    public function index(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);

        return $season
            ? $season->games()->with(['homeTeam', 'awayTeam', 'result.playerStats.player'])->get()
            : $this->notFound('Season');
    }

    public function store(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);
        if (! $season) {
            return $this->notFound('Season');
        }

        $data = $request->validate([
            'home_team_id' => ['required', 'integer', Rule::exists('teams', 'id')->where('season_id', $season->id)],
            'away_team_id' => ['required', 'integer', Rule::exists('teams', 'id')->where('season_id', $season->id)],
            'scheduled_at' => ['required', 'date'],
            'venue' => ['nullable', 'string', 'max:255'],
        ]);

        if ((int) $data['home_team_id'] === (int) $data['away_team_id']) {
            return response()->json(['message' => 'A team cannot play against itself.'], 422);
        }

        $existingMatchup = $season->games()
            ->where(function ($query) use ($data) {
                $query->where(function ($matchup) use ($data) {
                    $matchup->where('home_team_id', $data['home_team_id'])
                        ->where('away_team_id', $data['away_team_id']);
                })->orWhere(function ($matchup) use ($data) {
                    $matchup->where('home_team_id', $data['away_team_id'])
                        ->where('away_team_id', $data['home_team_id']);
                });
            })
            ->exists();

        if ($existingMatchup) {
            return response()->json(['message' => 'A game between these teams already exists in this season.'], 422);
        }

        $dateConflict = $season->games()
            ->whereDate('scheduled_at', $data['scheduled_at'])
            ->where(function ($query) use ($data) {
                $query->whereIn('home_team_id', [$data['home_team_id'], $data['away_team_id']])
                    ->orWhereIn('away_team_id', [$data['home_team_id'], $data['away_team_id']]);
            })
            ->exists();

        if ($dateConflict) {
            return response()->json(['message' => 'One of these teams already has a game scheduled on this date.'], 422);
        }

        return response()->json($season->games()->create($data + ['status' => 'scheduled']), 201);
    }

    public function show(Request $request, string $game)
    {
        $game = $this->gameForUser($request, $game);

        return $game ? $game->load(['homeTeam.players', 'awayTeam.players', 'result.playerStats.player']) : $this->notFound('Game');
    }

    public function submitResult(Request $request, string $game)
    {
        $game = $this->gameForUser($request, $game);
        if (! $game) {
            return $this->notFound('Game');
        }

        $data = $request->validate([
            'home_score' => ['required', 'integer', 'min:0'],
            'away_score' => ['required', 'integer', 'min:0'],
        ]);

        return DB::transaction(function () use ($game, $data) {
            $result = $game->result()->updateOrCreate(['game_id' => $game->id], $data);
            $game->update(['status' => 'done']);

            return response()->json($result->load('game'));
        });
    }

    public function submitStats(Request $request, string $game)
    {
        $game = $this->gameForUser($request, $game);
        if (! $game) {
            return $this->notFound('Game');
        }

        if ($game->status !== 'done' || ! $game->result) {
            return response()->json(['message' => 'Player stats can only be submitted after the game is done.'], 422);
        }

        $data = $request->validate([
            'stats' => ['required', 'array', 'min:1'],
            'stats.*.player_id' => ['required', 'integer', Rule::exists('players', 'id')],
            'stats.*.points' => ['required', 'integer', 'min:0'],
            'stats.*.assists' => ['required', 'integer', 'min:0'],
            'stats.*.rebounds' => ['required', 'integer', 'min:0'],
            'stats.*.fouls' => ['required', 'integer', 'min:0'],
        ]);

        $eligiblePlayerIds = $game->homeTeam->players()
            ->pluck('players.id')
            ->merge($game->awayTeam->players()->pluck('players.id'))
            ->unique()
            ->all();

        foreach ($data['stats'] as $stat) {
            if (! in_array($stat['player_id'], $eligiblePlayerIds, true)) {
                return response()->json(['message' => 'Stats can only be submitted for players assigned to the game teams.'], 422);
            }
        }

        $now = now();
        $rows = collect($data['stats'])->map(fn ($stat) => [
            'game_result_id' => $game->result->id,
            'player_id' => $stat['player_id'],
            'points' => $stat['points'],
            'assists' => $stat['assists'],
            'rebounds' => $stat['rebounds'],
            'fouls' => $stat['fouls'],
            'created_at' => $now,
            'updated_at' => $now,
        ])->all();

        $game->result->playerStats()->delete();
        $game->result->playerStats()->insert($rows);

        return response()->json($game->fresh()->load('result.playerStats.player'));
    }
}
