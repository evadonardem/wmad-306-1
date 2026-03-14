<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Category;
use App\Models\User;
use Database\Seeders\ArticleStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class WriterSubmissionFlowTest extends TestCase
{
    use RefreshDatabase;

    private function createWriterUser(): User
    {
        $guard = config('auth.defaults.guard', 'web');

        Permission::findOrCreate('article.create', $guard);
        Permission::findOrCreate('article.submit', $guard);
        Permission::findOrCreate('article.revise', $guard);

        $writerRole = Role::findOrCreate('writer', $guard);
        $writerRole->syncPermissions(['article.create', 'article.submit', 'article.revise']);

        $user = User::factory()->create();
        $user->assignRole('writer');

        return $user;
    }

    public function test_writer_can_save_draft_and_it_persists_to_database(): void
    {
        $this->seed(ArticleStatusSeeder::class);

        $writer = $this->createWriterUser();
        $category = Category::query()->create(['name' => 'Technology', 'slug' => 'technology']);

        $response = $this->actingAs($writer)->post(route('writer.articles.store'), [
            'title' => 'Draft Article Title',
            'content' => 'This is a test draft body.',
            'category_id' => $category->id,
        ]);

        $article = Article::query()->where('title', 'Draft Article Title')->first();

        $response->assertRedirect(route('writer.articles.edit', $article, false));
        $this->assertNotNull($article);
        $this->assertSame($writer->id, $article->user_id);
        $this->assertNotNull($article->slug);

        $draftStatusId = ArticleStatus::query()->where('slug', 'draft')->value('id');
        $this->assertSame($draftStatusId, $article->article_status_id);
        $this->assertNull($article->submitted_at);
    }

    public function test_writer_can_submit_for_review_directly_from_create_flow(): void
    {
        $this->seed(ArticleStatusSeeder::class);

        $writer = $this->createWriterUser();
        $category = Category::query()->create(['name' => 'Science', 'slug' => 'science']);

        $response = $this->actingAs($writer)->post(route('writer.articles.store'), [
            'title' => 'Ready For Review',
            'content' => 'Complete content that will be submitted immediately.',
            'category_id' => $category->id,
            'submit_for_review' => true,
        ]);

        $article = Article::query()->where('title', 'Ready For Review')->first();
        $submittedStatusId = ArticleStatus::query()->where('slug', 'submitted')->value('id');

        $response->assertRedirect(route('writer.dashboard', absolute: false));
        $this->assertNotNull($article);
        $this->assertSame($submittedStatusId, $article->article_status_id);
        $this->assertNotNull($article->submitted_at);
    }

    public function test_writer_can_submit_existing_draft_for_review(): void
    {
        $this->seed(ArticleStatusSeeder::class);

        $writer = $this->createWriterUser();
        $draftStatusId = ArticleStatus::query()->where('slug', 'draft')->value('id');
        $submittedStatusId = ArticleStatus::query()->where('slug', 'submitted')->value('id');

        $article = Article::factory()->create([
            'user_id' => $writer->id,
            'article_status_id' => $draftStatusId,
            'submitted_at' => null,
        ]);

        $response = $this->actingAs($writer)->post(route('writer.articles.submit', $article));

        $response->assertStatus(302);
        $article->refresh();
        $this->assertSame($submittedStatusId, $article->article_status_id);
        $this->assertNotNull($article->submitted_at);
    }
}

