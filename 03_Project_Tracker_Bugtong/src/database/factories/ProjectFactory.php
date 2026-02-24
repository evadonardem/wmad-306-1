<?php

namespace Database\Factories;

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
        $titles = [
            'Website Redesign',
            'Mobile App Launch',
            'Marketing Campaign',
            'Customer Portal',
            'Internal Tool Upgrade',
        ];
        $descriptions = [
            'A project to redesign the company website for better UX.',
            'Launching a new mobile app for our services.',
            'Coordinating a multi-channel marketing campaign.',
            'Building a secure portal for customers to manage their accounts.',
            'Upgrading internal tools to improve productivity.',
        ];
        return [
            'title' => $this->faker->randomElement($titles),
            'description' => $this->faker->randomElement($descriptions),
        ];
    }
}
