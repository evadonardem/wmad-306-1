<?php

namespace Database\Factories;

use App\Models\Season;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

class GameFactory extends Factory
{
    public function definition(): array
    {
        return [
            'season_id' => Season::factory(),
            'home_team_id' => Team::factory(),
            'away_team_id' => Team::factory(),
            'scheduled_at' => fake()->dateTimeBetween('now', '+30 days'),
            'venue' => fake()->city().' Court',
            'status' => 'scheduled',
        ];
    }
}