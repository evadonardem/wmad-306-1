<?php

namespace App\Http\Controllers;

use App\Models\Player;
use App\Models\Season;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StandingsController extends Controller
{
    /**
     * Get team standings for a season with W-L records, sorted by wins.
     */
    public function seasonStandings(Request $request, Season $season)
    {
        // Ensure the season belongs to a league owned by the authenticated user
        $season = Season::whereHas('league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($season->id);

        // Get all teams in the season
        $teams = $season->teams()->with('players')->get();

        // Get completed games for the season with results
        $completedGames = $season->games()
            ->where('status', 'done')
            ->with('result')
            ->get();

        // Initialize standings array
        $standings = [];

        foreach ($teams as $team) {
            $standings[$team->id] = [
                'team' => $team,
                'wins' => 0,
                'losses' => 0,
                'games_played' => 0,
            ];
        }

        // Calculate wins and losses for each team
        foreach ($completedGames as $game) {
            if (!$game->result) {
                continue;
            }

            $homeTeamId = $game->home_team_id;
            $awayTeamId = $game->away_team_id;
            $homeScore = $game->result->home_score;
            $awayScore = $game->result->away_score;

            // Update games played
            $standings[$homeTeamId]['games_played']++;
            $standings[$awayTeamId]['games_played']++;

            // Determine winner and update records
            if ($homeScore > $awayScore) {
                $standings[$homeTeamId]['wins']++;
                $standings[$awayTeamId]['losses']++;
            } else {
                $standings[$awayTeamId]['wins']++;
                $standings[$homeTeamId]['losses']++;
            }
        }

        // Convert to array and sort by wins (descending), then by team name
        $sortedStandings = collect($standings)
            ->sortByDesc('wins')
            ->values()
            ->map(function ($standing) {
                return [
                    'team' => [
                        'id' => $standing['team']->id,
                        'name' => $standing['team']->name,
                        'coach' => $standing['team']->coach,
                    ],
                    'wins' => $standing['wins'],
                    'losses' => $standing['losses'],
                    'games_played' => $standing['games_played'],
                    'win_percentage' => $standing['games_played'] > 0 
                        ? round(($standing['wins'] / $standing['games_played']) * 100, 1) 
                        : 0,
                ];
            });

        return response()->json([
            'season' => [
                'id' => $season->id,
                'name' => $season->name,
                'status' => $season->status,
            ],
            'standings' => $sortedStandings,
        ]);
    }

    /**
     * Get player leaderboard for a season - top 10 players by total points.
     */
    public function playerLeaderboard(Request $request, Season $season)
    {
        // Ensure the season belongs to a league owned by the authenticated user
        $season = Season::whereHas('league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($season->id);

        // Get top 10 players by total points across all completed games in the season
        $leaderboard = DB::table('players')
            ->join('player_stats', 'players.id', '=', 'player_stats.player_id')
            ->join('game_results', 'player_stats.game_result_id', '=', 'game_results.id')
            ->join('games', 'game_results.game_id', '=', 'games.id')
            ->where('games.season_id', $season->id)
            ->where('games.status', 'done')
            ->select(
                'players.id',
                'players.name',
                'players.position',
                DB::raw('SUM(player_stats.points) as total_points'),
                DB::raw('SUM(player_stats.assists) as total_assists'),
                DB::raw('SUM(player_stats.rebounds) as total_rebounds'),
                DB::raw('COUNT(DISTINCT games.id) as games_played')
            )
            ->groupBy('players.id', 'players.name', 'players.position')
            ->orderByDesc('total_points')
            ->limit(10)
            ->get();

        return response()->json([
            'season' => [
                'id' => $season->id,
                'name' => $season->name,
                'status' => $season->status,
            ],
            'leaderboard' => $leaderboard,
        ]);
    }

    /**
     * Get season summary statistics for a season.
     */
    public function seasonSummary(Request $request, Season $season)
    {
        // Ensure the season belongs to a league owned by the authenticated user
        $season = Season::whereHas('league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($season->id);

        // Get all games in the season
        $totalGames = $season->games()->count();
        $completedGames = $season->games()->where('status', 'done')->count();
        $scheduledGames = $totalGames - $completedGames;

        // Check if season has any completed games
        if ($completedGames === 0) {
            return response()->json([
                'message' => 'Season has no completed games',
                'season' => [
                    'id' => $season->id,
                    'name' => $season->name,
                    'status' => $season->status,
                ],
                'total_games_played' => 0,
                'total_games_scheduled' => $scheduledGames,
                'top_scoring_team' => null,
                'total_points_scored' => 0,
            ], 404);
        }

        // Get top scoring team (highest total points across all games)
        $topScoringTeam = DB::table('teams')
            ->join('games', function ($join) use ($season) {
                $join->on('teams.id', '=', 'games.home_team_id')
                    ->orOn('teams.id', '=', 'games.away_team_id');
            })
            ->join('game_results', 'games.id', '=', 'game_results.game_id')
            ->where('games.season_id', $season->id)
            ->where('games.status', 'done')
            ->select(
                'teams.id',
                'teams.name',
                DB::raw('SUM(
                    CASE 
                        WHEN games.home_team_id = teams.id THEN game_results.home_score
                        ELSE game_results.away_score
                    END
                ) as total_points')
            )
            ->groupBy('teams.id', 'teams.name')
            ->orderByDesc('total_points')
            ->first();

        // Get total points scored across all games in the season
        $totalPointsScored = DB::table('games')
            ->join('game_results', 'games.id', '=', 'game_results.game_id')
            ->where('games.season_id', $season->id)
            ->where('games.status', 'done')
            ->sum(DB::raw('game_results.home_score + game_results.away_score'));

        return response()->json([
            'season' => [
                'id' => $season->id,
                'name' => $season->name,
                'status' => $season->status,
            ],
            'total_games_played' => $completedGames,
            'total_games_scheduled' => $scheduledGames,
            'top_scoring_team' => $topScoringTeam ? [
                'id' => $topScoringTeam->id,
                'name' => $topScoringTeam->name,
                'total_points' => (int) $topScoringTeam->total_points,
            ] : null,
            'total_points_scored' => (int) $totalPointsScored,
        ]);
    }
}
