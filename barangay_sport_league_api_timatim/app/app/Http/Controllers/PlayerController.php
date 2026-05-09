<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PlayerController extends Controller
{
    public function index(Request $request)
    {
        $players = Player::query()->orderByDesc('id')->get();

        return response()->json($players);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'birthdate' => 'nullable|date',
            'position' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $player = Player::create([
            'name' => $request->input('name'),
            'birthdate' => $request->input('birthdate'),
            'position' => $request->input('position'),
        ]);

        return response()->json($player, 201);
    }

    public function show(Request $request, Player $player)
    {
        return response()->json($player);
    }
}
