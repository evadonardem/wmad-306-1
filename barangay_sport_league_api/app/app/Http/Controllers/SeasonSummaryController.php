<?php

namespace App\Http\Controllers;

use App\Models\Season;
use App\Models\Game;
use App\Models\GameResult;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SeasonSummaryController extends Controller
{
    public function summary(Request $request, Season $season)
    {
        if ($season->league->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Get all games for the season
        $totalGames = $season->games()->count();
        $completedGames = $season->games()->where('status', 'done')->count();
        $scheduledGames = $totalGames - $completedGames;

        // Check if season has any completed games
        if ($completedGames === 0) {
            return response()->json([
                'message' => 'Season has no completed games',
                'season_id' => $season->id,
                'season_name' => $season->name,
                'total_games_played' => 0,
                'games_scheduled' => $scheduledGames,
                'top_scoring_team' => null,
                'total_points_scored' => 0,
            ], 404);
        }

        // Calculate total points across all games
        $totalPoints = GameResult::join('games', 'game_results.game_id', '=', 'games.id')
            ->where('games.season_id', $season->id)
            ->sum(DB::raw('game_results.home_score + game_results.away_score'));

        // Calculate top scoring team
        $teamPoints = Team::select([
            'teams.*',
            DB::raw('SUM(CASE WHEN games.home_team_id = teams.id THEN game_results.home_score ELSE game_results.away_score END) as total_points')
        ])
        ->join('games', function($join) {
            $join->on('games.home_team_id', '=', 'teams.id')
                 ->orOn('games.away_team_id', '=', 'teams.id');
        })
        ->join('game_results', 'game_results.game_id', '=', 'games.id')
        ->where('games.season_id', $season->id)
        ->where('games.status', 'done')
        ->groupBy('teams.id')
        ->orderByDesc('total_points')
        ->first();

        return response()->json([
            'season_id' => $season->id,
            'season_name' => $season->name,
            'total_games_played' => $completedGames,
            'games_scheduled' => $scheduledGames,
            'top_scoring_team' => [
                'team' => $teamPoints,
                'total_points' => $teamPoints->total_points
            ],
            'total_points_scored' => $totalPoints,
        ]);
    }
}
