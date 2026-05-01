<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PlayerController extends Controller
{
    public function profile(Request $request, string $player)
    {
        $player = $this->playerForUser($request, $player);
        if (! $player) {
            return $this->notFound('Player');
        }

        $player->load(['teams.season']);

        $careerTotals = DB::table('player_stats')
            ->join('game_results', 'game_results.id', '=', 'player_stats.game_result_id')
            ->join('games', 'games.id', '=', 'game_results.game_id')
            ->join('seasons', 'seasons.id', '=', 'games.season_id')
            ->join('leagues', 'leagues.id', '=', 'seasons.league_id')
            ->where('player_stats.player_id', $player->id)
            ->where('leagues.user_id', $request->user()->id)
            ->where('games.status', 'done')
            ->selectRaw('COUNT(DISTINCT games.id) as total_games_played')
            ->selectRaw('COALESCE(SUM(player_stats.points), 0) as total_points')
            ->selectRaw('COALESCE(SUM(player_stats.assists), 0) as total_assists')
            ->selectRaw('COALESCE(SUM(player_stats.rebounds), 0) as total_rebounds')
            ->first();

        $bestGame = DB::table('player_stats')
            ->join('game_results', 'game_results.id', '=', 'player_stats.game_result_id')
            ->join('games', 'games.id', '=', 'game_results.game_id')
            ->join('seasons', 'seasons.id', '=', 'games.season_id')
            ->join('leagues', 'leagues.id', '=', 'seasons.league_id')
            ->where('player_stats.player_id', $player->id)
            ->where('leagues.user_id', $request->user()->id)
            ->where('games.status', 'done')
            ->select(
                'games.id as game_id',
                'games.scheduled_at',
                'games.venue',
                'player_stats.points'
            )
            ->orderByDesc('player_stats.points')
            ->first();

        return response()->json([
            'id' => $player->id,
            'name' => $player->name,
            'position' => $player->position,
            'teams' => $player->teams->map(fn ($team) => [
                'team_id' => $team->id,
                'team_name' => $team->name,
                'season_id' => $team->season?->id,
                'season_name' => $team->season?->name,
                'jersey_number' => $team->pivot->jersey_number,
            ])->values(),
            'career_totals' => [
                'total_games_played' => (int) ($careerTotals->total_games_played ?? 0),
                'total_points' => (int) ($careerTotals->total_points ?? 0),
                'total_assists' => (int) ($careerTotals->total_assists ?? 0),
                'total_rebounds' => (int) ($careerTotals->total_rebounds ?? 0),
            ],
            'personal_best_game' => $bestGame ? [
                'game_id' => $bestGame->game_id,
                'scheduled_at' => $bestGame->scheduled_at,
                'venue' => $bestGame->venue,
                'points' => (int) $bestGame->points,
            ] : null,
        ]);
    }
}
