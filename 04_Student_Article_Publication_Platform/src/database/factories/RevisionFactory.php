<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Revision;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Revision>
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
            'requested_by' => User::factory(),
            'notes' => $this->faker->paragraph(),
            'resolved_at' => null,
        ];
    }
}
