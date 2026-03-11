<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Revision;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $writers = User::role('writer')->get();
        $editors = User::role('editor')->get();

        if ($writers->isEmpty() || $editors->isEmpty()) {
            return;
        }

        $statuses = \App\Models\ArticleStatus::all()->keyBy('name');

        Article::factory()
            ->count(60)   // more demo data
            ->make()
            ->each(function ($article) use ($writers, $editors, $statuses) {

                $article->writer()->associate($writers->random());
                $article->editor()->associate($editors->random());

                $pick = rand(1,100);

                if ($pick <= 60) {
                    $article->status_id = $statuses->get('draft')->id;
                }
                elseif ($pick <= 85) {
                    $article->status_id = $statuses->get('submitted')->id;
                }
                else {
                    $article->status_id = $statuses->get('published')->id;
                }

                $article->category_id = \App\Models\Category::inRandomOrder()->first()->id ?? 1;

                $article->save();

                if ($article->status_id === ($statuses->get('needs_revision')->id ?? null)) {
                    Revision::factory()->for($article)->create();
                }

                if ($article->status_id === ($statuses->get('published')->id ?? null)) {
                    Comment::factory()
                        ->count(rand(3,8))
                        ->for($article)
                        ->create();
                }

            });

        // Ensure some demo articles are always published by the demo writer user
        $demoWriter = User::where('email', 'test@gmail.com')->first();
        if ($demoWriter) {
            Article::factory()
                ->count(10)
                ->create([
                    'writer_id' => $demoWriter->id,
                    'editor_id' => $editors->random()->id,
                    'status_id' => $statuses->get('published')->id,
                ]);
        }
    }
}