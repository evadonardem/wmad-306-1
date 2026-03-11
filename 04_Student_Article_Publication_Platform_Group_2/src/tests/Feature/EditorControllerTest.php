<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EditorControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'writer']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'editor']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'student']);
    }

    public function test_editor_can_publish_article()
    {
        $editor = User::factory()->create();
        $editor->assignRole('editor');

        $writer = User::factory()->create();
        $writer->assignRole('writer');

        $statusSubmitted = ArticleStatus::factory()->create(['name' => 'submitted']);
        $statusPublished = ArticleStatus::factory()->create(['name' => 'published']);

        $article = Article::factory()->create([
            'status_id' => $statusSubmitted->id,
            'writer_id' => $writer->id,
        ]);

        $response = $this->actingAs($editor)->post(route('editor.articles.publish', $article->id));
        $response->assertRedirect();

        $this->assertEquals('published', $article->fresh()->status->name);
    }

    public function test_editor_can_request_revision()
    {
        $editor = User::factory()->create();
        $editor->assignRole('editor');

        $writer = User::factory()->create();
        $writer->assignRole('writer');

        $statusSubmitted = ArticleStatus::factory()->create(['name' => 'submitted']);

        $article = Article::factory()->create([
            'status_id' => $statusSubmitted->id,
            'writer_id' => $writer->id,
        ]);

        $response = $this->actingAs($editor)->post(route('editor.articles.requestRevision', $article->id), [
            'comments' => 'Please improve clarity',
        ]);

        $response->assertRedirect();
        $this->assertEquals('needs_revision', $article->fresh()->status->name);
        $this->assertDatabaseHas('revisions', ['article_id' => $article->id]);
    }
}
