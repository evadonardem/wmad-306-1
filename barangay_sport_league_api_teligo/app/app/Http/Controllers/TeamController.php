<?php

namespace App\Http\Controllers;

use App\Models\Player;
use App\Models\PlayerStat;
use App\Models\Season;
use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index($seasonId)
    {
        $season = Season::findOrFail($seasonId);
        return response()->json($season->teams);
    }

    public function store(Request $request, $seasonId)
    {
        $season = Season::findOrFail($seasonId);

        $request->validate([
            'name'  => 'required|string|max:255',
            'coach' => 'required|string|max:255',
        ]);

        $team = $season->teams()->create($request->only('name', 'coach'));

        return response()->json($team, 201);
    }

    public function show($id)
    {
        $team = Team::with('players')->findOrFail($id);
        return response()->json($team);
    }

    public function update(Request $request, $id)
    {
        $team = Team::findOrFail($id);

        $request->validate([
            'name'  => 'sometimes|string|max:255',
            'coach' => 'sometimes|string|max:255',
        ]);

        $team->update($request->only('name', 'coach'));

        return response()->json($team);
    }

    public function storePlayer(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'birthdate' => 'required|date',
            'position'  => 'required|string|max:255',
        ]);

        $player = Player::create($request->only('name', 'birthdate', 'position'));

        return response()->json($player, 201);
    }

    public function indexPlayer()
    {
        return response()->json(Player::all());
    }

    public function playerProfile($id)
    {
        // Find player or return 404
        $player = Player::find($id);
        if (!$player) {
            return response()->json(['message' => 'Player not found.'], 404);
        }

        // Teams with season name and jersey number (eager loaded, no N+1)
        $teams = $player->teams()->with('season:id,name')->get()
            ->map(fn($team) => [
                'team'          => $team->name,
                'season'        => $team->season->name,
                'jersey_number' => $team->pivot->jersey_number,
            ]);

        // Career totals aggregated across all games
        $stats = PlayerStat::where('player_id', $id)->get();

        $careerTotals = [
            'games_played' => $stats->count(),
            'total_points'  => $stats->sum('points'),
            'total_assists'  => $stats->sum('assists'),
            'total_rebounds' => $stats->sum('rebounds'),
        ];

        // Personal best game (most points in a single game)
        $bestStat = PlayerStat::where('player_id', $id)
            ->with('gameResult.game')
            ->orderByDesc('points')
            ->first();

        $personalBest = $bestStat ? [
            'game_id' => $bestStat->gameResult->game->id,
            'points'  => $bestStat->points,
        ] : null;

        return response()->json([
            'name'          => $player->name,
            'position'      => $player->position,
            'teams'         => $teams,
            'career_totals' => $careerTotals,
            'personal_best' => $personalBest,
        ]);
    }

    public function addPlayer(Request $request, $id)
    {
        $team = Team::findOrFail($id);

        $request->validate([
            'player_id'     => 'required|exists:players,id',
            'jersey_number' => 'required|integer|min:0|max:99',
        ]);

        $team->players()->attach($request->player_id, [
            'jersey_number' => $request->jersey_number,
        ]);

        return response()->json(['message' => 'Player added to team']);
    }

    public function removePlayer($id, $playerId)
    {
        $team = Team::findOrFail($id);
        $team->players()->detach($playerId);

        return response()->json(['message' => 'Player removed from team']);
    }
}