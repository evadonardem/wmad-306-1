<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Support\Facades\DB;

class PlayerController extends Controller
{
    public function profile($id)
    {
        $player = Player::with('teams.season', 'stats.gameResult.game.season')->findOrFail($id);

        if (!$player) {
            return response()->json(['message' => 'Player not found'], 404);
        }

        // Format teams with pivot data and season info
        $teamsData = [];
        foreach ($player->teams as $team) {
            $teamsData[] = [
                'team_id' => $team->id,
                'team_name' => $team->name,
                'season_name' => $team->season->name,
                'jersey_number' => $team->pivot->jersey_number,
            ];
        }

        // Calculate career totals
        $careerStats = DB::table('player_stats')
            ->join('game_results', 'player_stats.game_result_id', '=', 'game_results.id')
            ->where('player_stats.player_id', $id)
            ->select(
                DB::raw('COUNT(DISTINCT game_results.id) as games_played'),
                DB::raw('COALESCE(SUM(player_stats.points), 0) as total_points'),
                DB::raw('COALESCE(SUM(player_stats.assists), 0) as total_assists'),
                DB::raw('COALESCE(SUM(player_stats.rebounds), 0) as total_rebounds')
            )
            ->first();

        // Get personal best game
        $personalBest = DB::table('player_stats')
            ->join('game_results', 'player_stats.game_result_id', '=', 'game_results.id')
            ->where('player_stats.player_id', $id)
            ->select('game_results.game_id', 'player_stats.points')
            ->orderByDesc('player_stats.points')
            ->first();

        return response()->json([
            'id' => $player->id,
            'name' => $player->name,
            'position' => $player->position,
            'teams' => $teamsData,
            'career_totals' => [
                'games_played' => (int) $careerStats->games_played,
                'total_points' => (int) $careerStats->total_points,
                'total_assists' => (int) $careerStats->total_assists,
                'total_rebounds' => (int) $careerStats->total_rebounds,
            ],
            'personal_best' => $personalBest ? [
                'game_id' => $personalBest->game_id,
                'points' => $personalBest->points,
            ] : null,
        ]);
    }
}
