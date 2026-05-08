<?php

namespace App\Http\Controllers;

use App\Models\PlayerStat;
use App\Models\Season;
use Illuminate\Support\Facades\DB;

class StandingsController extends Controller
{
    public function standings($seasonId)
    {
        $season = Season::with('teams')->findOrFail($seasonId);
        $games  = $season->games()->where('status', 'done')->with('result')->get();

        $standings = $season->teams->map(function ($team) use ($games) {
            $wins   = 0;
            $losses = 0;

            foreach ($games as $game) {
                $result = $game->result;
                if (!$result) continue;

                if ($game->home_team_id == $team->id) {
                    $game->result->home_score > $game->result->away_score ? $wins++ : $losses++;
                } elseif ($game->away_team_id == $team->id) {
                    $game->result->away_score > $game->result->home_score ? $wins++ : $losses++;
                }
            }

            return [
                'team'         => $team->name,
                'wins'         => $wins,
                'losses'       => $losses,
                'games_played' => $wins + $losses,
            ];
        })->sortByDesc('wins')->values();

        return response()->json($standings);
    }

    public function leaderboard($seasonId)
    {
        $season = Season::findOrFail($seasonId);

        $leaders = PlayerStat::select('player_id', DB::raw('SUM(points) as total_points'))
            ->whereHas('gameResult.game', fn($q) => $q->where('season_id', $seasonId))
            ->groupBy('player_id')
            ->orderByDesc('total_points')
            ->limit(10)
            ->with('player:id,name')
            ->get()
            ->map(fn($stat) => [
                'player'       => $stat->player->name,
                'total_points' => $stat->total_points,
            ]);

        return response()->json($leaders);
    }

    public function summary($seasonId)
    {
        $season = Season::findOrFail($seasonId);

        // Count games by status
        $gamesPlayed    = $season->games()->where('status', 'done')->count();
        $gamesScheduled = $season->games()->where('status', 'scheduled')->count();

        // Check if there are any completed games
        if ($gamesPlayed === 0) {
            return response()->json([
                'message' => 'No completed games found for this season.'
            ], 404);
        }

        // Total points scored across all games
        $totalPoints = $season->games()
            ->where('status', 'done')
            ->with('result')
            ->get()
            ->sum(fn($game) => $game->result
                ? $game->result->home_score + $game->result->away_score
                : 0
            );

        // Top scoring team (highest combined points across all games)
        $teams = $season->teams()->with([
            'homeGames' => fn($q) => $q->where('status', 'done')->with('result'),
            'awayGames' => fn($q) => $q->where('status', 'done')->with('result'),
        ])->get();

        $topTeam = $teams->map(function ($team) {
            $homePoints = $team->homeGames->sum(fn($g) => $g->result?->home_score ?? 0);
            $awayPoints = $team->awayGames->sum(fn($g) => $g->result?->away_score ?? 0);
            return [
                'team'         => $team->name,
                'total_points' => $homePoints + $awayPoints,
            ];
        })->sortByDesc('total_points')->first();

        return response()->json([
            'season'          => $season->name,
            'games_played'    => $gamesPlayed,
            'games_scheduled' => $gamesScheduled,
            'top_scoring_team'=> $topTeam,
            'total_points'    => $totalPoints,
        ]);
    }
}