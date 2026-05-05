<?php

namespace App\Http\Controllers;

use App\Models\Season;
use Illuminate\Support\Facades\DB;

class StandingsController extends Controller
{
    public function standings($seasonId)
    {
        $season = Season::findOrFail($seasonId);

        $teams = $season->teams()->get();
        $completedGames = $season->games()
            ->with('result')
            ->where('status', 'done')
            ->get();

        $standings = [];

        foreach ($teams as $team) {
            $wins = 0;
            $losses = 0;

            foreach ($completedGames as $game) {
                if ($game->home_team_id === $team->id) {
                    if ($game->result->home_score > $game->result->away_score) {
                        $wins++;
                    } else {
                        $losses++;
                    }
                } elseif ($game->away_team_id === $team->id) {
                    if ($game->result->away_score > $game->result->home_score) {
                        $wins++;
                    } else {
                        $losses++;
                    }
                }
            }

            $standings[] = [
                'team_name' => $team->name,
                'wins' => $wins,
                'losses' => $losses,
                'games_played' => $wins + $losses,
            ];
        }

        usort($standings, function ($a, $b) {
            return $b['wins'] - $a['wins'];
        });

        return response()->json($standings);
    }

    public function leaderboard($seasonId)
    {
        $season = Season::findOrFail($seasonId);

        $topScorers = DB::table('player_stats')
            ->join('game_results', 'player_stats.game_result_id', '=', 'game_results.id')
            ->join('games', 'game_results.game_id', '=', 'games.id')
            ->join('players', 'player_stats.player_id', '=', 'players.id')
            ->where('games.season_id', $seasonId)
            ->where('games.status', 'done')
            ->select('players.id', 'players.name')
            ->selectRaw('SUM(player_stats.points) as total_points')
            ->groupBy('players.id', 'players.name')
            ->orderByDesc('total_points')
            ->limit(10)
            ->get();

        return response()->json($topScorers);
    }

    public function summary($seasonId)
    {
        $season = Season::findOrFail($seasonId);

        $completedGames = $season->games()
            ->with('result')
            ->where('status', 'done')
            ->get();

        $scheduledGames = $season->games()
            ->where('status', 'scheduled')
            ->count();

        if ($completedGames->isEmpty()) {
            return response()->json(['message' => 'No completed games in this season'], 404);
        }

        $totalPointsScored = 0;
        $topScoringTeam = null;
        $maxTeamScore = 0;

        foreach ($completedGames as $game) {
            $homeScore = $game->result->home_score;
            $awayScore = $game->result->away_score;
            $totalPointsScored += $homeScore + $awayScore;

            if ($homeScore > $maxTeamScore) {
                $maxTeamScore = $homeScore;
                $topScoringTeam = $game->homeTeam->name;
            }
            if ($awayScore > $maxTeamScore) {
                $maxTeamScore = $awayScore;
                $topScoringTeam = $game->awayTeam->name;
            }
        }

        return response()->json([
            'total_games_played' => $completedGames->count(),
            'total_games_scheduled' => $scheduledGames,
            'top_scoring_team' => $topScoringTeam,
            'total_points_scored' => $totalPointsScored,
        ]);
    }
}
