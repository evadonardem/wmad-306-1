<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\JsonResponse;

class PlayerController extends Controller
{
    public function profile($id): JsonResponse
    {
        $player = Player::with('teams.season')->find($id);

        if (!$player) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        // career totals (simplified)
        $totalGames = $player->teams()->count();

        return response()->json([
            'message' => 'Success',
            'data' => [
                'name' => $player->name,
                'position' => $player->position,
                'teams' => $player->teams->map(function ($team) {
                    return [
                        'team_name' => $team->name,
                        'season_id' => $team->season_id,
                        'jersey_number' => $team->pivot->jersey_number
                    ];
                }),
                'career_totals' => [
                    'games_played' => $totalGames
                ]
            ]
        ]);
    }
}