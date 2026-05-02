<?php

namespace Database\Factories;

use App\Models\GameResult;
use App\Models\Player;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlayerStatFactory extends Factory
{
    public function definition(): array
    {
        return [
            'game_result_id' => GameResult::factory(),
            'player_id' => Player::factory(),
            'points' => fake()->numberBetween(0, 40),
            'assists' => fake()->numberBetween(0, 12),
            'rebounds' => fake()->numberBetween(0, 15),
            'fouls' => fake()->numberBetween(0, 5),
        ];
    }
}