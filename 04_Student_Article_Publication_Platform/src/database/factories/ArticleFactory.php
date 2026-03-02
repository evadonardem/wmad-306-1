<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Article>
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
        $title = $this->faker->sentence(6);

        return [
            'user_id' => User::factory(),
            'category_id' => Category::query()->inRandomOrder()->value('id') ?? Category::query()->create([
                'name' => 'General',
                'slug' => 'general',
            ])->id,
            'article_status_id' => ArticleStatus::query()->where('slug', 'draft')->value('id')
                ?? ArticleStatus::query()->create(['name' => 'Draft', 'slug' => 'draft'])->id,
            'title' => $title,
            'slug' => Str::slug($title).'-'.Str::lower(Str::random(6)),
            'content' => $this->faker->paragraphs(4, true),
            'submitted_at' => null,
            'published_at' => null,
        ];
    }
}
