<?php

namespace App\Http\Controllers;

use App\Models\Season;
use App\Models\Team;
use App\Models\Game;
use App\Models\GameResult; // New Import
use App\Models\PlayerStat; // New Import
use Illuminate\Http\Request;

class SeasonController extends Controller
{
    // GET /api/leagues/{id}/seasons - List seasons under a league
    public function index(Request $request, $leagueId)
    {
        $league = $request->user()->leagues()->findOrFail($leagueId);
        return response()->json($league->seasons);
    }

    // POST /api/leagues/{id}/seasons - Create a new season
    public function store(Request $request, $leagueId)
    {
        $league = $request->user()->leagues()->findOrFail($leagueId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'in:active,done'
        ]);

        $season = $league->seasons()->create($validated);

        return response()->json($season, 201);
    }

    // GET /api/seasons/{id} - Show season with teams and games
    public function show(Request $request, $id)
    {
        // Ensure the season belongs to a league owned by this user
        $season = Season::with(['teams', 'games'])->whereHas('league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($id);

        return response()->json($season);
    }

    // PUT /api/seasons/{id} - Update season
    public function update(Request $request, $id)
    {
        $season = Season::whereHas('league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'status' => 'sometimes|in:active,done'
        ]);

        $season->update($validated);

        return response()->json($season);
    }

    // GET /api/seasons/{id}/standings - Calculate team standings based on game results
    public function standings($id)
    {
        // 1. Verify the season exists
        $season = Season::findOrFail($id);

        // 2. Get all teams in this season
        $teams = Team::where('season_id', $id)->get();

        // 3. Get all FINISHED games with their results for this season
        $games = Game::with('result')
            ->where('season_id', $id)
            ->where('status', 'done')
            ->get();

        // 4. Calculate wins and losses for each team
        $standings = $teams->map(function ($team) use ($games) {
            $wins = 0;
            $losses = 0;

            foreach ($games as $game) {
                if ($game->result) {
                    // If they were the home team
                    if ($game->home_team_id == $team->id) {
                        if ($game->result->home_score > $game->result->away_score) $wins++;
                        elseif ($game->result->home_score < $game->result->away_score) $losses++;
                    }
                    // If they were the away team
                    elseif ($game->away_team_id == $team->id) {
                        if ($game->result->away_score > $game->result->home_score) $wins++;
                        elseif ($game->result->away_score < $game->result->home_score) $losses++;
                    }
                }
            }

            return [
                'team_id' => $team->id,
                'team_name' => $team->name,
                'wins' => $wins,
                'losses' => $losses,
                'games_played' => $wins + $losses
            ];
        });

        // 5. Sort by Wins (Highest to Lowest), then by Losses (Lowest to Highest)
        $sortedStandings = $standings->sortByDesc('wins')->sortBy('losses')->values();

        return response()->json($sortedStandings);
    }

    // GET /api/seasons/{id}/leaderboard - Get player stat rankings
    public function leaderboard(Request $request, $id)
    {
        // Verify season exists
        $season = Season::findOrFail($id);

        // Check if the user requested a specific sort (default is 'points')
        $sortBy = $request->query('sort', 'points');

        // 1. Get all finished games for this season
        $gameIds = Game::where('season_id', $id)->where('status', 'done')->pluck('id');

        // 2. Get the result IDs for those games
        $gameResultIds = GameResult::whereIn('game_id', $gameIds)->pluck('id');

        // 3. Gather all stats, group them by player, and calculate the totals
        $leaderboard = PlayerStat::with('player')
            ->whereIn('game_result_id', $gameResultIds)
            ->get()
            ->groupBy('player_id')
            ->map(function ($stats, $playerId) {
                return [
                    'player_id' => $playerId,
                    'name' => $stats->first()->player->name,
                    'games_played' => $stats->count(),
                    'total_points' => $stats->sum('points'),
                    'total_assists' => $stats->sum('assists'),
                    'total_rebounds' => $stats->sum('rebounds'),
                    'total_fouls' => $stats->sum('fouls'),
                ];
            })->values();

        // 4. Sort the leaderboard dynamically based on the requested stat
        $sortColumn = 'total_' . $sortBy;
        $sortedLeaderboard = $leaderboard->sortByDesc($sortColumn)->values();

        return response()->json($sortedLeaderboard);
    }
}
