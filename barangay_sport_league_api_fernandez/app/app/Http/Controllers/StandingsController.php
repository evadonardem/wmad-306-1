<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StandingsController extends Controller
{
    public function standings(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);
        if (! $season) {
            return $this->notFound('Season');
        }

        $teams = $season->teams()->get();
        $games = $season->games()
            ->where('status', 'done')
            ->with('result')
            ->get();

        return $teams->map(function (Team $team) use ($games) {
            $wins = 0;
            $losses = 0;

            foreach ($games as $game) {
                if (! $game->result || ! in_array($team->id, [$game->home_team_id, $game->away_team_id], true)) {
                    continue;
                }

                $isHome = $team->id === $game->home_team_id;
                $teamScore = $isHome ? $game->result->home_score : $game->result->away_score;
                $opponentScore = $isHome ? $game->result->away_score : $game->result->home_score;

                if ($teamScore > $opponentScore) {
                    $wins++;
                } elseif ($teamScore < $opponentScore) {
                    $losses++;
                }
            }

            return [
                'team_id' => $team->id,
                'team_name' => $team->name,
                'wins' => $wins,
                'losses' => $losses,
                'games_played' => $wins + $losses,
            ];
        })->sortByDesc('wins')->values();
    }

    public function leaderboard(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);
        if (! $season) {
            return $this->notFound('Season');
        }

        return DB::table('player_stats')
            ->join('players', 'players.id', '=', 'player_stats.player_id')
            ->join('game_results', 'game_results.id', '=', 'player_stats.game_result_id')
            ->join('games', 'games.id', '=', 'game_results.game_id')
            ->where('games.season_id', $season->id)
            ->where('games.status', 'done')
            ->select('players.id as player_id', 'players.name', DB::raw('SUM(player_stats.points) as total_points'))
            ->groupBy('players.id', 'players.name')
            ->orderByDesc('total_points')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'player_id' => (int) $row->player_id,
                'name' => $row->name,
                'total_points' => (int) $row->total_points,
            ]);
    }

    public function summary(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);
        if (! $season) {
            return $this->notFound('Season');
        }

        $completedGames = $season->games()->where('status', 'done')->with('result')->get();

        if ($completedGames->isEmpty()) {
            return response()->json(['message' => 'Season has no completed games.'], 404);
        }

        $teamPoints = [];
        $totalPoints = 0;

        foreach ($completedGames as $game) {
            if (! $game->result) {
                continue;
            }

            $teamPoints[$game->home_team_id] = ($teamPoints[$game->home_team_id] ?? 0) + $game->result->home_score;
            $teamPoints[$game->away_team_id] = ($teamPoints[$game->away_team_id] ?? 0) + $game->result->away_score;
            $totalPoints += $game->result->home_score + $game->result->away_score;
        }

        arsort($teamPoints);
        $topTeamId = array_key_first($teamPoints);
        $topTeam = $topTeamId ? Team::find($topTeamId) : null;

        return response()->json([
            'total_games_played' => $completedGames->count(),
            'total_games_scheduled' => $season->games()->where('status', 'scheduled')->count(),
            'top_scoring_team' => $topTeam ? [
                'team_id' => $topTeam->id,
                'team_name' => $topTeam->name,
                'total_points' => $teamPoints[$topTeamId],
            ] : null,
            'total_points_scored' => $totalPoints,
        ]);
    }
}
