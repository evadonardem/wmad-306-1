<?php

namespace App\Http\Controllers\Api;

use App\Models\Team;
use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;

class PlayerController extends Controller
{
    /**
     * Display all players for a team
     */
    public function index(Request $request, Team $team): Response
    {
        $this->authorize('view', $team);

        $players = $team->players()->with('stats.game')->get();

        return response([
            'data' => $players,
        ]);
    }

    /**
     * Store a newly created player
     */
    public function store(Request $request, Team $team): Response
    {
        $this->authorize('update', $team);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'jersey_number' => 'required|integer|min:1|max:99',
            'position' => 'nullable|string|max:50',
            'height_cm' => 'nullable|integer|min:100|max:250',
            'contact' => 'nullable|string|max:255',
        ]);

        $player = $team->players()->create($validated);

        return response([
            'data' => $player,
            'message' => 'Player created successfully',
        ], 201);
    }

    /**
     * Display a specific player
     */
    public function show(Request $request, Team $team, Player $player): Response
    {
        $this->authorize('view', $team);

        if ($player->team_id !== $team->id) {
            return response(['message' => 'Player not found'], 404);
        }

        return response([
            'data' => $player->load('stats.game'),
        ]);
    }

    /**
     * Update a player
     */
    public function update(Request $request, Team $team, Player $player): Response
    {
        $this->authorize('update', $team);

        if ($player->team_id !== $team->id) {
            return response(['message' => 'Player not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'jersey_number' => 'sometimes|integer|min:1|max:99',
            'position' => 'nullable|string|max:50',
            'height_cm' => 'nullable|integer|min:100|max:250',
            'contact' => 'nullable|string|max:255',
        ]);

        $player->update($validated);

        return response([
            'data' => $player,
            'message' => 'Player updated successfully',
        ]);
    }

    /**
     * Delete a player
     */
    public function destroy(Request $request, Team $team, Player $player): Response
    {
        $this->authorize('delete', $team);

        if ($player->team_id !== $team->id) {
            return response(['message' => 'Player not found'], 404);
        }

        $player->delete();

        return response([
            'message' => 'Player deleted successfully',
        ]);
    }
}
