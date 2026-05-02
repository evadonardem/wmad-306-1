<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeagueFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->city().' Barangay League',
            'sport' => fake()->randomElement(['Basketball', 'Volleyball', 'Sepak Takraw']),
            'description' => fake()->sentence(),
        ];
    }
}