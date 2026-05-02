<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PlayerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'birthdate' => fake()->dateTimeBetween('-35 years', '-18 years')->format('Y-m-d'),
            'position' => fake()->randomElement(['Guard', 'Forward', 'Center', 'Setter', 'Libero']),
        ];
    }
}