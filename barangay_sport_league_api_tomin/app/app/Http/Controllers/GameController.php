<?php

namespace App\Http\Controllers;

use App\Http\Requests\Game\ScheduleGameRequest;
use App\Http\Requests\Game\SubmitResultRequest;
use App\Http\Requests\Game\SubmitStatsRequest;
use App\Models\Game;
use App\Models\Season;
use App\Traits\ApiResponder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    use ApiResponder;

    public function index(Request $request, string $seasonId): JsonResponse
    {
        $season = $this->resolveSeasonForUser($request, $seasonId);

        if (! $season) {
            return $this->notFound('Season');
        }

        $games = $season->games()
            ->with(['homeTeam', 'awayTeam', 'result'])
            ->orderBy('scheduled_at')
            ->get();

        return $this->ok($games);
    }

    public function store(ScheduleGameRequest $request, string $seasonId): JsonResponse
    {
        $season = $this->resolveSeasonForUser($request, $seasonId);

        if (! $season) {
            return $this->notFound('Season');
        }

        $data = $request->validated();
        $homeId = (int) $data['home_team_id'];
        $awayId = (int) $data['away_team_id'];

        // Both teams must belong to this season
        $seasonTeamIds = $season->teams()->pluck('id');
        if (! $seasonTeamIds->contains($homeId) || ! $seasonTeamIds->contains($awayId)) {
            return $this->conflict('Both teams must be registered in this season.');
        }

        // No duplicate matchups (order-independent)
        $matchupExists = $season->games()->where(function ($q) use ($homeId, $awayId) {
            $q->where(fn ($q) => $q->where('home_team_id', $homeId)->where('away_team_id', $awayId))
              ->orWhere(fn ($q) => $q->where('home_team_id', $awayId)->where('away_team_id', $homeId));
        })->exists();

        if ($matchupExists) {
            return $this->conflict('This matchup already exists in the season. Each pair of teams can only play once.');
        }

        // No team can have two games on the same calendar date
        $dateConflict = $season->games()
            ->whereDate('scheduled_at', date('Y-m-d', strtotime($data['scheduled_at'])))
            ->where(function ($q) use ($homeId, $awayId) {
                $q->whereIn('home_team_id', [$homeId, $awayId])
                  ->orWhereIn('away_team_id', [$homeId, $awayId]);
            })->exists();

        if ($dateConflict) {
            return $this->conflict('One or both teams already have a game scheduled on that date.');
        }

        $game = $season->games()->create(array_merge($data, ['status' => 'scheduled']));

        return $this->created(
            $game->load(['homeTeam', 'awayTeam']),
            'Game scheduled successfully.'
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $game = $this->resolveGameForUser($request, $id);

        if (! $game) {
            return $this->notFound('Game');
        }

        return $this->ok(
            $game->load(['homeTeam.players', 'awayTeam.players', 'result.playerStats.player'])
        );
    }

    public function submitResult(SubmitResultRequest $request, string $id): JsonResponse
    {
        $game = $this->resolveGameForUser($request, $id);

        if (! $game) {
            return $this->notFound('Game');
        }

        $result = DB::transaction(function () use ($game, $request) {
            $result = $game->result()->updateOrCreate(
                ['game_id' => $game->id],
                $request->validated()
            );
            $game->update(['status' => 'done']);
            return $result;
        });

        return $this->ok(
            $result->load('game'),
            "Final score recorded: {$result->home_score} – {$result->away_score}."
        );
    }

    public function submitStats(SubmitStatsRequest $request, string $id): JsonResponse
    {
        $game = $this->resolveGameForUser($request, $id);

        if (! $game) {
            return $this->notFound('Game');
        }

        if (! $game->isFinished()) {
            return $this->conflict('Stats can only be submitted after the game result has been recorded.');
        }

        if (! $game->result) {
            return $this->conflict('No result found for this game. Please submit the result first.');
        }

        // Build eligible player id set from both rosters
        $rosterIds = $game->homeTeam->players()->pluck('players.id')
            ->merge($game->awayTeam->players()->pluck('players.id'))
            ->unique();

        $data = $request->validated()['stats'];

        foreach ($data as $stat) {
            if (! $rosterIds->contains($stat['player_id'])) {
                return $this->conflict(
                    "Player ID {$stat['player_id']} is not on either team's roster for this game."
                );
            }
        }

        $now  = now();
        $rows = collect($data)->map(fn ($s) => [
            'game_result_id' => $game->result->id,
            'player_id'      => $s['player_id'],
            'points'         => $s['points'],
            'assists'        => $s['assists'],
            'rebounds'       => $s['rebounds'],
            'fouls'          => $s['fouls'],
            'created_at'     => $now,
            'updated_at'     => $now,
        ])->all();

        // Replace existing stats for idempotent submission
        $game->result->playerStats()->delete();
        $game->result->playerStats()->insert($rows);

        return $this->ok(
            $game->load('result.playerStats.player'),
            count($rows) . ' player stat entries saved.'
        );
    }

    // ─── Private ──────────────────────────────────────────────────────────────

    private function resolveSeasonForUser(Request $request, string $id): ?Season
    {
        return Season::whereHas('league', fn ($q) => $q->where('user_id', $request->user()->id))
            ->find($id);
    }

    private function resolveGameForUser(Request $request, string $id): ?Game
    {
        return Game::whereHas('season.league', fn ($q) => $q->where('user_id', $request->user()->id))
            ->find($id);
    }
}
