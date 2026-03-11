<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Article;
use App\Models\ArticleStatus;

class ArticlePolicyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // ensure roles exist for tests
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'writer']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'editor']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'student']);
    }

    public function test_editor_can_publish_and_request_revision()
    {
        $editor = User::factory()->create();
        $editor->assignRole('editor');

        $submitted = ArticleStatus::factory()->create(['name' => 'submitted']);

        $article = Article::factory()->create([
            'status_id' => $submitted->id,
        ]);

        $this->assertTrue($editor->can('publish', $article));
        $this->assertTrue($editor->can('requestRevision', $article));
    }

    public function test_non_editor_cannot_publish_or_request_revision()
    {
        $user = User::factory()->create();
        $user->assignRole('writer');

        $submitted = ArticleStatus::factory()->create(['name' => 'submitted']);

        $article = Article::factory()->create([
            'status_id' => $submitted->id,
        ]);

        $this->assertFalse($user->can('publish', $article));
        $this->assertFalse($user->can('requestRevision', $article));
    }

    public function test_writer_can_submit_own_article()
    {
        $writer = User::factory()->create();
        $writer->assignRole('writer');

        $status = ArticleStatus::factory()->create(['name' => 'draft']);
        $article = Article::factory()->create(['writer_id' => $writer->id, 'status_id' => $status->id]);

        $this->assertTrue($writer->can('submit', $article));
    }

    public function test_student_cannot_submit()
    {
        $student = User::factory()->create();
        $student->assignRole('student');
        $article = Article::factory()->create();

        $this->assertFalse($student->can('submit', $article));
    }
}
