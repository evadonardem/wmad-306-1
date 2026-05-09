<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PlayerProfileController extends Controller
{
    /**
     * Get a player's complete career profile.
     */
    public function profile(Request $request, Player $player)
    {
        // Load player with teams and seasons using eager loading to avoid N+1 queries
        $player->load([
            'teams.season.league',
            'playerStats.gameResult.game'
        ]);

        // Get teams list with season name and jersey number from pivot
        $teamsList = $player->teams->map(function ($team) {
            return [
                'team_id' => $team->id,
                'team_name' => $team->name,
                'season_name' => $team->season->name,
                'jersey_number' => $team->pivot->jersey_number,
                'season_id' => $team->season->id,
            ];
        });

        // Calculate career totals across all seasons
        $careerTotals = [
            'total_games_played' => 0,
            'total_points' => 0,
            'total_assists' => 0,
            'total_rebounds' => 0,
        ];

        foreach ($player->playerStats as $stat) {
            $careerTotals['total_games_played']++;
            $careerTotals['total_points'] += $stat->points;
            $careerTotals['total_assists'] += $stat->assists;
            $careerTotals['total_rebounds'] += $stat->rebounds;
        }

        // Find personal best game (most points in a single game)
        $personalBestGame = null;
        $maxPoints = 0;

        foreach ($player->playerStats as $stat) {
            if ($stat->points > $maxPoints) {
                $maxPoints = $stat->points;
                $personalBestGame = [
                    'game_id' => $stat->gameResult->game->id,
                    'scheduled_at' => $stat->gameResult->game->scheduled_at,
                    'venue' => $stat->gameResult->game->venue,
                    'home_team' => $stat->gameResult->game->homeTeam->name,
                    'away_team' => $stat->gameResult->game->awayTeam->name,
                    'home_score' => $stat->gameResult->home_score,
                    'away_score' => $stat->gameResult->away_score,
                    'points' => $stat->points,
                    'assists' => $stat->assists,
                    'rebounds' => $stat->rebounds,
                    'fouls' => $stat->fouls,
                ];
            }
        }

        return response()->json([
            'player' => [
                'id' => $player->id,
                'name' => $player->name,
                'position' => $player->position,
                'birthdate' => $player->birthdate,
            ],
            'teams' => $teamsList,
            'career_totals' => $careerTotals,
            'personal_best_game' => $personalBestGame,
        ]);
    }
}
