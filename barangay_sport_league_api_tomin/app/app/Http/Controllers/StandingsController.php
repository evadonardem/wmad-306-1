<?php

namespace App\Http\Controllers;

use App\Models\Season;
use App\Models\Team;
use App\Traits\ApiResponder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class StandingsController extends Controller
{
    use ApiResponder;

    /**
     * GET /api/seasons/{id}/standings
     * Returns win-loss record per team, sorted by wins descending.
     */
    public function standings(Request $request, string $seasonId): JsonResponse
    {
        $season = $this->resolveSeasonForUser($request, $seasonId);

        if (! $season) {
            return $this->notFound('Season');
        }

        $teams    = $season->teams()->get();
        $finished = $season->games()
            ->where('status', 'done')
            ->with('result')
            ->get();

        $table = $teams->map(function (Team $team) use ($finished) {
            $record = $this->computeRecord($team->id, $finished);

            return [
                'team_id'      => $team->id,
                'team_name'    => $team->name,
                'coach'        => $team->coach,
                'wins'         => $record['wins'],
                'losses'       => $record['losses'],
                'draws'        => $record['draws'],
                'games_played' => $record['wins'] + $record['losses'] + $record['draws'],
            ];
        })->sortByDesc('wins')->values();

        return $this->ok($table);
    }

    /**
     * GET /api/seasons/{id}/leaderboard
     * Returns top 10 players by total points in the season.
     */
    public function leaderboard(Request $request, string $seasonId): JsonResponse
    {
        $season = $this->resolveSeasonForUser($request, $seasonId);

        if (! $season) {
            return $this->notFound('Season');
        }

        $leaders = DB::table('player_stats')
            ->join('players',      'players.id',      '=', 'player_stats.player_id')
            ->join('game_results', 'game_results.id', '=', 'player_stats.game_result_id')
            ->join('games',        'games.id',        '=', 'game_results.game_id')
            ->where('games.season_id', $season->id)
            ->where('games.status',    'done')
            ->groupBy('players.id', 'players.name', 'players.position')
            ->orderByDesc('total_points')
            ->limit(10)
            ->select([
                'players.id as player_id',
                'players.name',
                'players.position',
                DB::raw('SUM(player_stats.points)   as total_points'),
                DB::raw('SUM(player_stats.assists)  as total_assists'),
                DB::raw('SUM(player_stats.rebounds) as total_rebounds'),
                DB::raw('COUNT(DISTINCT games.id)   as games_played'),
            ])
            ->get()
            ->map(fn ($row) => [
                'rank'          => 0,           // filled below
                'player_id'     => (int) $row->player_id,
                'name'          => $row->name,
                'position'      => $row->position,
                'total_points'  => (int) $row->total_points,
                'total_assists' => (int) $row->total_assists,
                'total_rebounds'=> (int) $row->total_rebounds,
                'games_played'  => (int) $row->games_played,
            ])
            ->values()
            ->map(function ($row, $index) {
                $row['rank'] = $index + 1;
                return $row;
            });

        return $this->ok($leaders);
    }

    /**
     * GET /api/seasons/{id}/summary  — Exercise 1
     */
    public function summary(Request $request, string $seasonId): JsonResponse
    {
        $season = $this->resolveSeasonForUser($request, $seasonId);

        if (! $season) {
            return $this->notFound('Season');
        }

        $completedGames = $season->completedGames()->with('result')->get();

        if ($completedGames->isEmpty()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'No completed games found for this season yet.',
            ], 404);
        }

        // Tally per-team scoring
        $teamScores    = [];
        $totalPoints   = 0;

        foreach ($completedGames as $game) {
            if (! $game->result) {
                continue;
            }

            $teamScores[$game->home_team_id] = ($teamScores[$game->home_team_id] ?? 0) + $game->result->home_score;
            $teamScores[$game->away_team_id] = ($teamScores[$game->away_team_id] ?? 0) + $game->result->away_score;
            $totalPoints += $game->result->home_score + $game->result->away_score;
        }

        arsort($teamScores);
        $topTeamId    = array_key_first($teamScores);
        $topTeam      = $topTeamId ? Team::find($topTeamId) : null;

        return $this->ok([
            'games_played'        => $completedGames->count(),
            'games_remaining'     => $season->games()->where('status', 'scheduled')->count(),
            'total_points_scored' => $totalPoints,
            'top_scoring_team'    => $topTeam ? [
                'team_id'      => $topTeam->id,
                'team_name'    => $topTeam->name,
                'total_scored' => $teamScores[$topTeamId],
            ] : null,
        ]);
    }

    // ─── Private ──────────────────────────────────────────────────────────────

    private function resolveSeasonForUser(Request $request, string $id): ?Season
    {
        return Season::whereHas('league', fn ($q) => $q->where('user_id', $request->user()->id))
            ->find($id);
    }

    /**
     * Compute a team's win / loss / draw record from a collection of finished games.
     */
    private function computeRecord(int $teamId, Collection $games): array
    {
        $wins = $losses = $draws = 0;

        foreach ($games as $game) {
            if (! $game->involvesTeam($teamId) || ! $game->result) {
                continue;
            }

            $isHome     = $game->home_team_id === $teamId;
            $myScore    = $isHome ? $game->result->home_score : $game->result->away_score;
            $theirScore = $isHome ? $game->result->away_score : $game->result->home_score;

            if ($myScore > $theirScore) {
                $wins++;
            } elseif ($myScore < $theirScore) {
                $losses++;
            } else {
                $draws++;
            }
        }

        return compact('wins', 'losses', 'draws');
    }
}
