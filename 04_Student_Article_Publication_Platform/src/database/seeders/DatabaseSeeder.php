<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Comment;
use App\Models\Revision;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            ArticleStatusSeeder::class,
            CategorySeeder::class,
            SubmissionDeadlineSeeder::class,
            UserSeeder::class,
            EditorReviewQueueSeeder::class,
        ]);

        $writer = User::query()->where('email', 'writer@example.com')->first();
        $editor = User::query()->where('email', 'editor@example.com')->first();
        $student = User::query()->where('email', 'student@example.com')->first();
        $publishedStatusId = ArticleStatus::query()->where('slug', 'published')->value('id');

        // Stop early when core seed prerequisites are missing.
        if (! $writer || ! $editor || ! $student || ! $publishedStatusId) {
            return;
        }

        // Only generate demo articles on a fresh database.
        if (Article::query()->count() === 0) {
            // Sample articles visible on public pages.
            $publicArticles = Article::factory()->count(3)->create([
                'user_id' => $writer->id,
                'article_status_id' => $publishedStatusId,
                'published_at' => now()->subDays(2),
                'is_public' => true,
                'public_approved_by' => $editor->id,
                'public_approved_at' => now()->subDay(),
            ]);

            // Sample published articles that remain internal-only.
            Article::factory()->count(2)->create([
                'user_id' => $writer->id,
                'article_status_id' => $publishedStatusId,
                'published_at' => now()->subDay(),
                'is_public' => false,
                'public_approved_by' => null,
                'public_approved_at' => null,
            ]);

            // Add related revision/comment data so demo pages look realistic.
            foreach ($publicArticles as $article) {
                Revision::factory()->create([
                    'article_id' => $article->id,
                    'requested_by' => $editor->id,
                ]);

                Comment::factory()->count(2)->create([
                    'article_id' => $article->id,
                    'user_id' => $student->id,
                ]);
            }
        }
    }
}
