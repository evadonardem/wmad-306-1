<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    // POST /api/players - Create a standalone player record
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'birthdate' => 'required|date',
            'position' => 'required|string|max:50'
        ]);

        $player = Player::create($validated);

        return response()->json($player, 201);
    }
}
