<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['active', 'paused', 'completed', 'archived']),
            'start_date' => $this->faker->dateTimeBetween('-3 months')->format('Y-m-d'),
            'end_date' => $this->faker->dateTimeBetween('+1 months', '+6 months')->format('Y-m-d'),
        ];
    }
}
