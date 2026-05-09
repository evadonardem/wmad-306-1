<?php

namespace App\Http\Controllers;

use App\Models\League;
use App\Models\Season;
use App\Models\Team;
use App\Models\Player;
use App\Models\GameResult;
use App\Models\PlayerStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StandingsController extends Controller
{
    public function standings(Request $request, Season $season)
    {
        if ($season->league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $teams = $season->teams()->with('homeGames.gameResult', 'awayGames.gameResult')->get();

        $standings = $teams->map(function ($team) {
            $games = $team->allGames()->where('season_id', $team->season_id)->get();
            $completedGames = $games->filter(function ($game) {
                return $game->status === 'done' && $game->gameResult;
            });

            $wins = 0;
            $losses = 0;
            $draws = 0;
            $pointsFor = 0;
            $pointsAgainst = 0;

            foreach ($completedGames as $game) {
                $result = $game->gameResult;

                if ($game->home_team_id === $team->id) {
                    $pointsFor += $result->home_score;
                    $pointsAgainst += $result->away_score;

                    if ($result->home_score > $result->away_score) {
                        $wins++;
                    } elseif ($result->home_score < $result->away_score) {
                        $losses++;
                    } else {
                        $draws++;
                    }
                } else {
                    $pointsFor += $result->away_score;
                    $pointsAgainst += $result->home_score;

                    if ($result->away_score > $result->home_score) {
                        $wins++;
                    } elseif ($result->away_score < $result->home_score) {
                        $losses++;
                    } else {
                        $draws++;
                    }
                }
            }

            $gamesPlayed = $wins + $losses + $draws;

            return [
                'team' => $team,
                'games_played' => $gamesPlayed,
                'wins' => $wins,
                'losses' => $losses,
                'draws' => $draws,
            ];
        })->sortByDesc('wins')->values();

        return response()->json($standings);
    }

    public function playerLeaderboard(Request $request, Season $season)
    {
        if ($season->league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $playerStats = Player::select([
            'players.*',
            DB::raw('SUM(player_stats.points) as total_points'),
        ])
        ->join('player_stats', 'players.id', '=', 'player_stats.player_id')
        ->join('game_results', 'player_stats.game_result_id', '=', 'game_results.id')
        ->join('games', 'game_results.game_id', '=', 'games.id')
        ->where('games.season_id', $season->id)
        ->groupBy('players.id')
        ->orderByDesc('total_points')
        ->limit(10)
        ->get();

        return response()->json($playerStats);
    }

    public function topScorers(Request $request, Season $season)
    {
        return $this->playerLeaderboard($request, $season);
    }
}
