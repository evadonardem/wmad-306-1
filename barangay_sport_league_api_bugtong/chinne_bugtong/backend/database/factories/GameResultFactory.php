<?php

namespace Database\Factories;

use App\Models\Game;
use Illuminate\Database\Eloquent\Factories\Factory;

class GameResultFactory extends Factory
{
    public function definition(): array
    {
        return [
            'game_id' => Game::factory(),
            'home_score' => fake()->numberBetween(40, 120),
            'away_score' => fake()->numberBetween(40, 120),
        ];
    }
}