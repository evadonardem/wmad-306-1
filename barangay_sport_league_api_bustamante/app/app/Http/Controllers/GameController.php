<?php

namespace App\Http\Controllers;

use App\Models\PlayerStat;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    public function index(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);
        $games = $season->games()
            ->with(['homeTeam', 'awayTeam', 'result'])
            ->orderBy('scheduled_at')
            ->get();

        return $this->success('Games retrieved successfully.', $games);
    }

    public function store(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);

        $validated = $request->validate([
            'home_team_id' => ['required', 'integer', 'exists:teams,id'],
            'away_team_id' => ['required', 'integer', 'exists:teams,id'],
            'scheduled_at' => ['required', 'date'],
            'venue' => ['nullable', 'string', 'max:255'],
        ]);

        $homeTeamId = (int) $validated['home_team_id'];
        $awayTeamId = (int) $validated['away_team_id'];

        if ($homeTeamId === $awayTeamId) {
            return $this->fail('A team cannot play against itself.');
        }

        $teamIdsInSeason = $season->teams()
            ->whereIn('id', [$homeTeamId, $awayTeamId])
            ->pluck('id')
            ->all();

        if (count($teamIdsInSeason) !== 2) {
            return $this->fail('Both teams must belong to the selected season.');
        }

        $duplicateMatchup = $season->games()
            ->where(function ($query) use ($homeTeamId, $awayTeamId) {
                $query->where(function ($query) use ($homeTeamId, $awayTeamId) {
                    $query->where('home_team_id', $homeTeamId)
                        ->where('away_team_id', $awayTeamId);
                })->orWhere(function ($query) use ($homeTeamId, $awayTeamId) {
                    $query->where('home_team_id', $awayTeamId)
                        ->where('away_team_id', $homeTeamId);
                });
            })
            ->exists();

        if ($duplicateMatchup) {
            return $this->fail('A game between these teams already exists in this season.');
        }

        $scheduledDate = Carbon::parse($validated['scheduled_at'])->toDateString();
        $dateConflict = $season->games()
            ->whereDate('scheduled_at', $scheduledDate)
            ->where(function ($query) use ($homeTeamId, $awayTeamId) {
                $query->whereIn('home_team_id', [$homeTeamId, $awayTeamId])
                    ->orWhereIn('away_team_id', [$homeTeamId, $awayTeamId]);
            })
            ->with(['homeTeam', 'awayTeam'])
            ->first();

        if ($dateConflict) {
            return $this->fail(sprintf(
                'Schedule conflict: %s vs %s is already scheduled on %s.',
                $dateConflict->homeTeam->name,
                $dateConflict->awayTeam->name,
                $scheduledDate
            ));
        }

        $game = $season->games()->create([
            ...$validated,
            'status' => 'scheduled',
        ]);

        $game->load(['homeTeam', 'awayTeam']);

        return $this->success('Game scheduled successfully.', $game, 201);
    }

    public function show(Request $request, string $game)
    {
        $game = $this->gameForUser($request, $game);
        $game->load([
            'season',
            'homeTeam.players',
            'awayTeam.players',
            'result.stats.player',
        ]);

        return $this->success('Game retrieved successfully.', $game);
    }

    public function submitResult(Request $request, string $game)
    {
        $game = $this->gameForUser($request, $game);

        $validated = $request->validate([
            'home_score' => ['required', 'integer', 'min:0'],
            'away_score' => ['required', 'integer', 'min:0'],
        ]);

        $result = DB::transaction(function () use ($game, $validated) {
            $result = $game->result()->updateOrCreate(
                ['game_id' => $game->id],
                [
                    'home_score' => $validated['home_score'],
                    'away_score' => $validated['away_score'],
                ]
            );

            $game->update(['status' => 'done']);

            return $result;
        });

        $game->refresh()->load(['homeTeam', 'awayTeam', 'result']);

        return $this->success('Game result submitted successfully.', [
            'game' => $game,
            'result' => $result,
        ], 201);
    }

    public function submitStats(Request $request, string $game)
    {
        $game = $this->gameForUser($request, $game);
        $game->load(['homeTeam.players', 'awayTeam.players', 'result']);

        if ($game->status !== 'done') {
            return $this->fail('Player stats can only be submitted for games with status done.');
        }

        if (! $game->result) {
            return $this->fail('Submit the game result before adding player stats.');
        }

        $validated = $request->validate([
            'stats' => ['required', 'array', 'min:1'],
            'stats.*.player_id' => ['required', 'integer', 'distinct', 'exists:players,id'],
            'stats.*.points' => ['required', 'integer', 'min:0'],
            'stats.*.assists' => ['required', 'integer', 'min:0'],
            'stats.*.rebounds' => ['required', 'integer', 'min:0'],
            'stats.*.fouls' => ['required', 'integer', 'min:0'],
        ]);

        $eligiblePlayerIds = $game->homeTeam->players
            ->pluck('id')
            ->merge($game->awayTeam->players->pluck('id'))
            ->unique()
            ->values();

        $submittedPlayerIds = collect($validated['stats'])->pluck('player_id')->values();
        $ineligiblePlayerIds = $submittedPlayerIds->diff($eligiblePlayerIds);

        if ($ineligiblePlayerIds->isNotEmpty()) {
            return $this->fail('All submitted players must belong to either team in this game.', 422, [
                'player_ids' => $ineligiblePlayerIds->values(),
            ]);
        }

        $now = now();
        $rows = collect($validated['stats'])->map(fn ($stat) => [
            'game_result_id' => $game->result->id,
            'player_id' => $stat['player_id'],
            'points' => $stat['points'],
            'assists' => $stat['assists'],
            'rebounds' => $stat['rebounds'],
            'fouls' => $stat['fouls'],
            'created_at' => $now,
            'updated_at' => $now,
        ])->all();

        PlayerStat::upsert(
            $rows,
            ['game_result_id', 'player_id'],
            ['points', 'assists', 'rebounds', 'fouls', 'updated_at']
        );

        $game->result->load('stats.player');

        return $this->success('Player stats submitted successfully.', $game->result->stats, 201);
    }
}
