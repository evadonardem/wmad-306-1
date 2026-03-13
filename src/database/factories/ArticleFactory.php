<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Article>
 */
class ArticleFactory extends Factory
{
    protected $model = Article::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(rand(4, 8));

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'content' => fake()->paragraphs(rand(3, 7), true),
            'writer_id' => User::factory(),
            'editor_id' => null,
            'category_id' => Category::factory(),
            'status_id' => ArticleStatus::where('name', 'Draft')->first()?->id ?? 1,
        ];
    }

    /**
     * Set article as draft status.
     */
    public function draft(): static
    {
        return $this->state(fn () => [
            'status_id' => ArticleStatus::where('name', 'Draft')->first()->id,
        ]);
    }

    /**
     * Set article as submitted status.
     */
    public function submitted(): static
    {
        return $this->state(fn () => [
            'status_id' => ArticleStatus::where('name', 'Submitted')->first()->id,
        ]);
    }

    /**
     * Set article as needs revision status.
     */
    public function needsRevision(): static
    {
        return $this->state(fn () => [
            'status_id' => ArticleStatus::where('name', 'Needs Revision')->first()->id,
        ]);
    }

    /**
     * Set article as published status.
     */
    public function published(): static
    {
        return $this->state(fn () => [
            'status_id' => ArticleStatus::where('name', 'Published')->first()->id,
        ]);
    }
}
