<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Comment;
use App\Models\Revision;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Call the configuration seeders FIRST (Order matters!)
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            ArticleStatusSeeder::class,
            CategorySeeder::class,
        ]);

        // 2. Generate Sample Data (Articles with Revisions and Comments)
        // Creates 10 articles, and for each, attaches 1 revision and 2 comments
        Article::factory(10)->create()->each(function ($article) {
            Revision::factory(1)->create(['article_id' => $article->id]);
            Comment::factory(2)->create(['article_id' => $article->id]);
        });
    }
}
