<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition()
    {
        return [
            'article_id' => Article::factory(),
            'student_id' => User::factory(),
            'content' => $this->faker->sentence(),
        ];
    }
}
