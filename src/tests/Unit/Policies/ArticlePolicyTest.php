<?php

namespace Tests\Unit\Policies;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Category;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ArticlePolicyTest extends TestCase
{
    private User $writer;
    private User $editor;
    private User $student;
    private Article $article;
    private ArticleStatus $draftStatus;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles
        Role::findOrCreate('writer', 'web');
        Role::findOrCreate('editor', 'web');
        Role::findOrCreate('student', 'web');

        // Create users
        $this->writer = User::factory()->create();
        $this->writer->assignRole('writer');

        $this->editor = User::factory()->create();
        $this->editor->assignRole('editor');

        $this->student = User::factory()->create();
        $this->student->assignRole('student');

        // Create article status
        $this->draftStatus = ArticleStatus::create([
            'name' => 'Draft',
            'description' => 'Article is in draft state',
        ]);

        // Create category
        $category = Category::create([
            'name' => 'Technology',
            'slug' => 'technology',
            'description' => 'Tech articles',
        ]);

        // Create article
        $this->article = Article::create([
            'title' => 'Test Article',
            'slug' => 'test-article',
            'content' => 'This is test content',
            'writer_id' => $this->writer->id,
            'category_id' => $category->id,
            'status_id' => $this->draftStatus->id,
        ]);
    }

    public function test_writer_can_create_article(): void
    {
        $this->assertTrue($this->writer->can('create', Article::class));
    }

    public function test_editor_cannot_create_article(): void
    {
        $this->assertFalse($this->editor->can('create', Article::class));
    }

    public function test_student_cannot_create_article(): void
    {
        $this->assertFalse($this->student->can('create', Article::class));
    }

    public function test_writer_can_edit_own_article(): void
    {
        $this->assertTrue($this->writer->can('edit', $this->article));
    }

    public function test_writer_cannot_edit_other_article(): void
    {
        $otherWriter = User::factory()->create();
        $otherWriter->assignRole('writer');

        $this->assertFalse($otherWriter->can('edit', $this->article));
    }

    public function test_editor_cannot_edit_article(): void
    {
        $this->assertFalse($this->editor->can('edit', $this->article));
    }

    public function test_writer_can_submit_article(): void
    {
        $this->assertTrue($this->writer->can('submit', $this->article));
    }

    public function test_editor_cannot_submit_article(): void
    {
        $this->assertFalse($this->editor->can('submit', $this->article));
    }

    public function test_editor_can_review_article(): void
    {
        $this->assertTrue($this->editor->can('review', $this->article));
    }

    public function test_writer_cannot_review_article(): void
    {
        $this->assertFalse($this->writer->can('review', $this->article));
    }

    public function test_editor_can_request_revision(): void
    {
        $this->assertTrue($this->editor->can('requestRevision', $this->article));
    }

    public function test_writer_cannot_request_revision(): void
    {
        $this->assertFalse($this->writer->can('requestRevision', $this->article));
    }

    public function test_editor_can_publish_article(): void
    {
        $this->assertTrue($this->editor->can('publish', $this->article));
    }

    public function test_writer_cannot_publish_article(): void
    {
        $this->assertFalse($this->writer->can('publish', $this->article));
    }

    public function test_writer_can_delete_own_article(): void
    {
        $this->assertTrue($this->writer->can('delete', $this->article));
    }

    public function test_writer_cannot_delete_other_article(): void
    {
        $otherWriter = User::factory()->create();
        $otherWriter->assignRole('writer');

        $this->assertFalse($otherWriter->can('delete', $this->article));
    }

    public function test_editor_cannot_delete_article(): void
    {
        $this->assertFalse($this->editor->can('delete', $this->article));
    }
}
