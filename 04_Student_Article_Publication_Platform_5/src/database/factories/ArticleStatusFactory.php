<?php

namespace Database\Factories;

use App\Models\ArticleStatus;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ArticleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'content' => fake()->paragraphs(4, true),
            'status_id' => ArticleStatus::inRandomOrder()->first()->id ?? 1,
            'category_id' => Category::inRandomOrder()->first()->id ?? 1,
            'writer_id' => User::role('writer')->inRandomOrder()->first()->id ?? User::factory(),
            'editor_id' => User::role('editor')->inRandomOrder()->first()->id ?? null,
        ];
    }
}
