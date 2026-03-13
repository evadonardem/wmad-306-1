<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Revision;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Revision>
 */
class RevisionFactory extends Factory
{
    protected $model = Revision::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'article_id' => Article::factory(),
            'editor_id' => User::factory(),
            'feedback' => fake()->paragraph(rand(2, 5)),
        ];
    }
}
