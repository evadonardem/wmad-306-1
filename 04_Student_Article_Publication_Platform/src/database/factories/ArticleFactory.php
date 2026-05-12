<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Article>
 */
class ArticleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Article::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'content' => '<p>' . fake()->paragraphs(3, true) . '</p>',
            'user_id' => User::factory(),
            'status' => fake()->randomElement(['draft', 'published']),
            'published_at' => function (array $attributes) {
                return $attributes['status'] === 'published' ? fake()->dateTimeBetween('-1 year', 'now') : null;
            },
        ];
    }
}