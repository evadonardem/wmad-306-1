<?php

namespace App\Http\Controllers\Api;

use App\Models\Season;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;

class LeaderboardController extends Controller
{
    /**
     * Get player leaderboard for a season
     */
    public function season(Request $request, Season $season): Response
    {
        $this->authorize('view', $season->league);

        $leaderboard = $season->teams()
            ->get()
            ->flatMap(function ($team) {
                return $team->players;
            })
            ->map(function ($player) {
                $stats = $player->stats()
                    ->get()
                    ->reduce(function ($carry, $stat) {
                        return [
                            'points' => $carry['points'] + $stat->points,
                            'rebounds' => $carry['rebounds'] + $stat->rebounds,
                            'assists' => $carry['assists'] + $stat->assists,
                            'steals' => $carry['steals'] + $stat->steals,
                            'blocks' => $carry['blocks'] + $stat->blocks,
                        ];
                    }, ['points' => 0, 'rebounds' => 0, 'assists' => 0, 'steals' => 0, 'blocks' => 0]);

                $gamesPlayed = $player->stats()->count();

                return [
                    'player_id' => $player->id,
                    'name' => $player->name,
                    'team' => $player->team->name,
                    'jersey_number' => $player->jersey_number,
                    'games_played' => $gamesPlayed,
                    'points' => $stats['points'],
                    'rebounds' => $stats['rebounds'],
                    'assists' => $stats['assists'],
                    'steals' => $stats['steals'],
                    'blocks' => $stats['blocks'],
                    'ppg' => $gamesPlayed > 0 ? round($stats['points'] / $gamesPlayed, 2) : 0,
                    'rpg' => $gamesPlayed > 0 ? round($stats['rebounds'] / $gamesPlayed, 2) : 0,
                    'apg' => $gamesPlayed > 0 ? round($stats['assists'] / $gamesPlayed, 2) : 0,
                ];
            })
            ->sortByDesc('points')
            ->values();

        return response([
            'season' => $season->name,
            'year' => $season->year,
            'leaderboard' => $leaderboard,
        ]);
    }

    /**
     * Get team leaderboard
     */
    public function team(Request $request, Team $team): Response
    {
        $this->authorize('view', $team);

        $leaderboard = $team->players()
            ->get()
            ->map(function ($player) {
                $stats = $player->stats()
                    ->get()
                    ->reduce(function ($carry, $stat) {
                        return [
                            'points' => $carry['points'] + $stat->points,
                            'rebounds' => $carry['rebounds'] + $stat->rebounds,
                            'assists' => $carry['assists'] + $stat->assists,
                            'steals' => $carry['steals'] + $stat->steals,
                            'blocks' => $carry['blocks'] + $stat->blocks,
                        ];
                    }, ['points' => 0, 'rebounds' => 0, 'assists' => 0, 'steals' => 0, 'blocks' => 0]);

                $gamesPlayed = $player->stats()->count();

                return [
                    'player_id' => $player->id,
                    'name' => $player->name,
                    'jersey_number' => $player->jersey_number,
                    'position' => $player->position,
                    'games_played' => $gamesPlayed,
                    'points' => $stats['points'],
                    'rebounds' => $stats['rebounds'],
                    'assists' => $stats['assists'],
                    'steals' => $stats['steals'],
                    'blocks' => $stats['blocks'],
                    'ppg' => $gamesPlayed > 0 ? round($stats['points'] / $gamesPlayed, 2) : 0,
                    'rpg' => $gamesPlayed > 0 ? round($stats['rebounds'] / $gamesPlayed, 2) : 0,
                    'apg' => $gamesPlayed > 0 ? round($stats['assists'] / $gamesPlayed, 2) : 0,
                ];
            })
            ->sortByDesc('points')
            ->values();

        return response([
            'team' => $team->name,
            'leaderboard' => $leaderboard,
        ]);
    }
}
