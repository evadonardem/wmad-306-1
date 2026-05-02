<?php

namespace App\Http\Controllers;

use App\Models\Player;
use App\Models\PlayerStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PlayerProfileController extends Controller
{
    public function profile(Request $request, Player $player)
    {
        // Eager load all necessary relationships to avoid N+1 queries
        $player->load([
            'teams.season',
            'playerStats.gameResult.game'
        ]);

        // Get teams list with season name and jersey number
        $teamsList = $player->teams->map(function ($team) {
            return [
                'team_id' => $team->id,
                'team_name' => $team->name,
                'season_name' => $team->season->name,
                'jersey_number' => $team->pivot->jersey_number,
                'coach' => $team->coach,
            ];
        });

        // Calculate career totals across all seasons
        $careerTotals = [
            'total_games_played' => $player->playerStats->count(),
            'total_points' => $player->playerStats->sum('points'),
            'total_assists' => $player->playerStats->sum('assists'),
            'total_rebounds' => $player->playerStats->sum('rebounds'),
            'total_fouls' => $player->playerStats->sum('fouls'),
        ];

        // Find personal best game (most points in a single game)
        $bestGame = $player->playerStats->sortByDesc('points')->first();

        $personalBestGame = null;
        if ($bestGame) {
            $game = $bestGame->gameResult->game;
            $personalBestGame = [
                'game_id' => $game->id,
                'date' => $game->scheduled_at->format('Y-m-d H:i:s'),
                'venue' => $game->venue,
                'home_team' => $game->homeTeam->name,
                'away_team' => $game->awayTeam->name,
                'home_score' => $bestGame->gameResult->home_score,
                'away_score' => $bestGame->gameResult->away_score,
                'points_scored' => $bestGame->points,
                'assists' => $bestGame->assists,
                'rebounds' => $bestGame->rebounds,
                'fouls' => $bestGame->fouls,
            ];
        }

        return response()->json([
            'player_info' => [
                'id' => $player->id,
                'name' => $player->name,
                'birthdate' => $player->birthdate->format('Y-m-d'),
                'position' => $player->position,
            ],
            'teams' => $teamsList,
            'career_totals' => $careerTotals,
            'personal_best_game' => $personalBestGame,
        ]);
    }
}
