<?php

namespace Database\Factories;

use App\Models\Revision;
use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class RevisionFactory extends Factory
{
    protected $model = Revision::class;

    public function definition()
    {
        return [
            'article_id' => Article::factory(),
            'editor_id' => User::factory(),
            'comments' => $this->faker->paragraph(),
        ];
    }
}
