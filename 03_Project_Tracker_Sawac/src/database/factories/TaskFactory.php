<?php

namespace Database\Factories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        $priorities = ['low', 'medium', 'high'];
        $statuses = ['todo', 'in_progress', 'done'];

        return [
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'priority' => $priorities[array_rand($priorities)],
            'status' => $statuses[array_rand($statuses)],
        ];
    }
}
