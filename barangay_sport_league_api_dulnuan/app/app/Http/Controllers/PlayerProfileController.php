<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;

class PlayerProfileController extends Controller
{
    public function profile(Request $request, Player $player)
    {
        $player->load(['teams', 'playerStats.gameResult.game']);

        return response()->json([
            'player' => $player,
            'total_points' => $player->total_points,
            'total_assists' => $player->total_assists,
            'total_rebounds' => $player->total_rebounds,
            'games_played' => $player->games_played,
        ]);
    }
}
