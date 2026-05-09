<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PlayerController extends Controller
{
    public function index(Request $request)
    {
        $players = Player::with('teams')->get();
        return response()->json($players);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'birthdate' => 'required|date|before:today',
            'position' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $player = Player::create($request->all());

        return response()->json($player, 201);
    }

    public function show(Request $request, Player $player)
    {
        $player->load(['teams', 'playerStats.gameResult.game']);
        return response()->json($player);
    }

    public function update(Request $request, Player $player)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'birthdate' => 'sometimes|required|date|before:today',
            'position' => 'sometimes|required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $player->update($request->all());

        return response()->json($player);
    }

    public function destroy(Request $request, Player $player)
    {
        $player->delete();

        return response()->json(['message' => 'Player deleted successfully']);
    }
}