<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameResult;
use App\Models\PlayerStat;
use App\Models\Season;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GameController extends Controller
{
    /**
     * Display a listing of games for a specific season.
     */
    public function index(Request $request, Season $season)
    {
        // Ensure the season belongs to a league owned by the authenticated user
        $season = Season::whereHas('league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($season->id);

        $games = $season->games()
            ->with(['homeTeam', 'awayTeam', 'result'])
            ->get();
        
        return response()->json($games);
    }

    /**
     * Store a newly created game in storage.
     */
    public function store(Request $request, Season $season)
    {
        // Ensure the season belongs to a league owned by the authenticated user
        $season = Season::whereHas('league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($season->id);

        $validator = Validator::make($request->all(), [
            'home_team_id' => 'required|exists:teams,id',
            'away_team_id' => 'required|exists:teams,id',
            'scheduled_at' => 'required|date|after:now',
            'venue' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Validation: Both teams must belong to the same season
        $homeTeam = Team::find($request->home_team_id);
        $awayTeam = Team::find($request->away_team_id);

        if ($homeTeam->season_id !== $season->id) {
            return response()->json(['message' => 'Home team does not belong to this season'], 422);
        }

        if ($awayTeam->season_id !== $season->id) {
            return response()->json(['message' => 'Away team does not belong to this season'], 422);
        }

        // Validation: A team cannot play against itself
        if ($request->home_team_id === $request->away_team_id) {
            return response()->json(['message' => 'A team cannot play against itself'], 422);
        }

        // Validation: Check if the same matchup already exists in the season (order-independent)
        $existingMatchup = $season->games()
            ->where(function ($query) use ($request) {
                $query->where('home_team_id', $request->home_team_id)
                      ->where('away_team_id', $request->away_team_id);
            })
            ->orWhere(function ($query) use ($request) {
                $query->where('home_team_id', $request->away_team_id)
                      ->where('away_team_id', $request->home_team_id);
            })
            ->first();

        if ($existingMatchup) {
            return response()->json([
                'message' => 'A game between these teams already exists in this season'
            ], 422);
        }

        // Validation: Check if either team already has a game scheduled on the same date
        $scheduledDate = date('Y-m-d', strtotime($request->scheduled_at));
        
        $homeTeamConflict = $season->games()
            ->where(function ($query) use ($request, $scheduledDate) {
                $query->where('home_team_id', $request->home_team_id)
                      ->orWhere('away_team_id', $request->home_team_id);
            })
            ->whereDate('scheduled_at', $scheduledDate)
            ->first();

        if ($homeTeamConflict) {
            return response()->json([
                'message' => 'Home team already has a game scheduled on ' . $scheduledDate
            ], 422);
        }

        $awayTeamConflict = $season->games()
            ->where(function ($query) use ($request, $scheduledDate) {
                $query->where('home_team_id', $request->away_team_id)
                      ->orWhere('away_team_id', $request->away_team_id);
            })
            ->whereDate('scheduled_at', $scheduledDate)
            ->first();

        if ($awayTeamConflict) {
            return response()->json([
                'message' => 'Away team already has a game scheduled on ' . $scheduledDate
            ], 422);
        }

        $game = $season->games()->create([
            'home_team_id' => $request->home_team_id,
            'away_team_id' => $request->away_team_id,
            'scheduled_at' => $request->scheduled_at,
            'venue' => $request->venue,
            'status' => 'scheduled',
        ]);

        $game->load(['homeTeam', 'awayTeam']);

        return response()->json($game, 201);
    }

    public function storeDirect(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'season_id' => 'required|integer',
            'home_team_id' => 'required|exists:teams,id',
            'away_team_id' => 'required|exists:teams,id',
            'scheduled_at' => 'required|date|after:now',
            'venue' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $season = Season::whereHas('league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($request->input('season_id'));

        // Validation: Both teams must belong to the same season
        $homeTeam = Team::find($request->home_team_id);
        $awayTeam = Team::find($request->away_team_id);

        if ($homeTeam->season_id !== $season->id) {
            return response()->json(['message' => 'Home team does not belong to this season'], 422);
        }

        if ($awayTeam->season_id !== $season->id) {
            return response()->json(['message' => 'Away team does not belong to this season'], 422);
        }

        // Validation: A team cannot play against itself
        if ($request->home_team_id === $request->away_team_id) {
            return response()->json(['message' => 'A team cannot play against itself'], 422);
        }

        // Validation: Check if the same matchup already exists in the season (order-independent)
        $existingMatchup = $season->games()
            ->where(function ($query) use ($request) {
                $query->where('home_team_id', $request->home_team_id)
                      ->where('away_team_id', $request->away_team_id);
            })
            ->orWhere(function ($query) use ($request) {
                $query->where('home_team_id', $request->away_team_id)
                      ->where('away_team_id', $request->home_team_id);
            })
            ->first();

        if ($existingMatchup) {
            return response()->json([
                'message' => 'A game between these teams already exists in this season'
            ], 422);
        }

        // Validation: Check if either team already has a game scheduled on the same date
        $scheduledDate = date('Y-m-d', strtotime($request->scheduled_at));

        $homeTeamConflict = $season->games()
            ->where(function ($query) use ($request, $scheduledDate) {
                $query->where('home_team_id', $request->home_team_id)
                      ->orWhere('away_team_id', $request->home_team_id);
            })
            ->whereDate('scheduled_at', $scheduledDate)
            ->first();

        if ($homeTeamConflict) {
            return response()->json([
                'message' => 'Home team already has a game scheduled on ' . $scheduledDate
            ], 422);
        }

        $awayTeamConflict = $season->games()
            ->where(function ($query) use ($request, $scheduledDate) {
                $query->where('home_team_id', $request->away_team_id)
                      ->orWhere('away_team_id', $request->away_team_id);
            })
            ->whereDate('scheduled_at', $scheduledDate)
            ->first();

        if ($awayTeamConflict) {
            return response()->json([
                'message' => 'Away team already has a game scheduled on ' . $scheduledDate
            ], 422);
        }

        $game = $season->games()->create([
            'home_team_id' => $request->home_team_id,
            'away_team_id' => $request->away_team_id,
            'scheduled_at' => $request->scheduled_at,
            'venue' => $request->venue,
            'status' => 'scheduled',
        ]);

        $game->load(['homeTeam', 'awayTeam']);

        return response()->json($game, 201);
    }

    /**
     * Display the specified game.
     */
    public function show(Request $request, Game $game)
    {
        // Ensure the game belongs to a season owned by the authenticated user
        $game = Game::whereHas('season.league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($game->id);

        $game->load(['homeTeam', 'awayTeam', 'result.playerStats.player']);
        
        return response()->json($game);
    }

    /**
     * Update the specified game in storage.
     */
    public function update(Request $request, Game $game)
    {
        // Ensure the game belongs to a season owned by the authenticated user
        $game = Game::whereHas('season.league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($game->id);

        $validator = Validator::make($request->all(), [
            'scheduled_at' => 'sometimes|required|date|after:now',
            'venue' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|in:scheduled,done',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $game->update($request->all());
        $game->load(['homeTeam', 'awayTeam', 'result']);

        return response()->json($game);
    }

    /**
     * Remove the specified game from storage.
     */
    public function destroy(Request $request, Game $game)
    {
        // Ensure the game belongs to a season owned by the authenticated user
        $game = Game::whereHas('season.league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($game->id);
        
        $game->delete();

        return response()->json(['message' => 'Game deleted successfully']);
    }

    /**
     * Submit game result and update game status to done.
     */
    public function submitResult(Request $request, Game $game)
    {
        // Ensure the game belongs to a season owned by the authenticated user
        $game = Game::whereHas('season.league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($game->id);

        $validator = Validator::make($request->all(), [
            'home_score' => 'required|integer|min:0',
            'away_score' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Check if game already has a result
        if ($game->result) {
            return response()->json(['message' => 'Game already has a result'], 422);
        }

        // Create game result
        $result = $game->result()->create([
            'home_score' => $request->home_score,
            'away_score' => $request->away_score,
        ]);

        // Update game status to done
        $game->update(['status' => 'done']);

        $game->load(['homeTeam', 'awayTeam', 'result']);

        return response()->json($game, 201);
    }

    /**
     * Submit individual player stats for a game.
     */
    public function submitStats(Request $request, Game $game)
    {
        // Ensure the game belongs to a season owned by the authenticated user
        $game = Game::whereHas('season.league', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($game->id);

        // Game must have status done before stats can be submitted
        if ($game->status !== 'done') {
            return response()->json(['message' => 'Stats can only be submitted for completed games'], 422);
        }

        // Game must have a result
        if (!$game->result) {
            return response()->json(['message' => 'Game must have a result before stats can be submitted'], 422);
        }

        $validator = Validator::make($request->all(), [
            'stats' => 'required|array|min:1',
            'stats.*.player_id' => 'required|exists:players,id',
            'stats.*.points' => 'required|integer|min:0',
            'stats.*.assists' => 'required|integer|min:0',
            'stats.*.rebounds' => 'required|integer|min:0',
            'stats.*.fouls' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Validate that all players belong to either home or away team
        $teamPlayerIds = $game->homeTeam->players->pluck('id')
            ->merge($game->awayTeam->players->pluck('id'))
            ->toArray();

        foreach ($request->stats as $stat) {
            if (!in_array($stat['player_id'], $teamPlayerIds)) {
                return response()->json([
                    'message' => 'Player ' . $stat['player_id'] . ' is not playing in this game'
                ], 422);
            }
        }

        // Bulk insert player stats
        $statsData = [];
        foreach ($request->stats as $stat) {
            $statsData[] = [
                'game_result_id' => $game->result->id,
                'player_id' => $stat['player_id'],
                'points' => $stat['points'],
                'assists' => $stat['assists'],
                'rebounds' => $stat['rebounds'],
                'fouls' => $stat['fouls'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        PlayerStat::insert($statsData);

        $game->load(['homeTeam', 'awayTeam', 'result.playerStats.player']);

        return response()->json($game, 201);
    }
}
