<?php

namespace App\Http\Controllers;

use App\Models\Player;
use App\Traits\ApiResponder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PlayerController extends Controller
{
    use ApiResponder;

    /**
     * GET /api/players/{id}/profile  — Exercise 3
     * Full career profile for a player, scoped to leagues owned by the auth user.
     */
    public function profile(Request $request, string $id): JsonResponse
    {
        // Player must exist and have participated in at least one league owned by this user
        $player = Player::find($id);

        if (! $player) {
            return $this->notFound('Player');
        }

        // Eager-load teams with season name — scoped to auth user's leagues
        $player->load([
            'teams' => function ($q) use ($request) {
                $q->whereHas('season.league', fn ($q) => $q->where('user_id', $request->user()->id))
                  ->with('season:id,name');
            },
        ]);

        // Career aggregates — only games in this user's leagues
        $careerRow = DB::table('player_stats')
            ->join('game_results', 'game_results.id', '=', 'player_stats.game_result_id')
            ->join('games',        'games.id',        '=', 'game_results.game_id')
            ->join('seasons',      'seasons.id',      '=', 'games.season_id')
            ->join('leagues',      'leagues.id',      '=', 'seasons.league_id')
            ->where('player_stats.player_id', $player->id)
            ->where('leagues.user_id',        $request->user()->id)
            ->where('games.status',           'done')
            ->selectRaw('COUNT(DISTINCT games.id)             AS total_games')
            ->selectRaw('COALESCE(SUM(player_stats.points),   0) AS total_points')
            ->selectRaw('COALESCE(SUM(player_stats.assists),  0) AS total_assists')
            ->selectRaw('COALESCE(SUM(player_stats.rebounds), 0) AS total_rebounds')
            ->selectRaw('COALESCE(SUM(player_stats.fouls),    0) AS total_fouls')
            ->first();

        // Best single-game performance
        $bestGame = DB::table('player_stats')
            ->join('game_results', 'game_results.id', '=', 'player_stats.game_result_id')
            ->join('games',        'games.id',        '=', 'game_results.game_id')
            ->join('seasons',      'seasons.id',      '=', 'games.season_id')
            ->join('leagues',      'leagues.id',      '=', 'seasons.league_id')
            ->where('player_stats.player_id', $player->id)
            ->where('leagues.user_id',        $request->user()->id)
            ->where('games.status',           'done')
            ->select('games.id', 'games.scheduled_at', 'games.venue', 'player_stats.points',
                     'player_stats.assists', 'player_stats.rebounds')
            ->orderByDesc('player_stats.points')
            ->first();

        return $this->ok([
            'player' => [
                'id'       => $player->id,
                'name'     => $player->name,
                'position' => $player->position,
                'birthdate'=> $player->birthdate?->format('Y-m-d'),
            ],
            'teams' => $player->teams->map(fn ($team) => [
                'team_id'       => $team->id,
                'team_name'     => $team->name,
                'season_id'     => $team->season?->id,
                'season_name'   => $team->season?->name,
                'jersey_number' => $team->pivot->jersey_number,
            ])->values(),
            'career_totals' => [
                'games_played'   => (int) ($careerRow->total_games   ?? 0),
                'total_points'   => (int) ($careerRow->total_points  ?? 0),
                'total_assists'  => (int) ($careerRow->total_assists  ?? 0),
                'total_rebounds' => (int) ($careerRow->total_rebounds ?? 0),
                'total_fouls'    => (int) ($careerRow->total_fouls   ?? 0),
            ],
            'personal_best' => $bestGame ? [
                'game_id'      => $bestGame->id,
                'scheduled_at' => $bestGame->scheduled_at,
                'venue'        => $bestGame->venue,
                'points'       => (int) $bestGame->points,
                'assists'      => (int) $bestGame->assists,
                'rebounds'     => (int) $bestGame->rebounds,
            ] : null,
        ]);
    }
}
