<?php

namespace Tests\Unit\Policies;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Category;
use App\Models\Comment;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CommentPolicyTest extends TestCase
{
    private User $student;
    private User $writer;
    private Article $publishedArticle;
    private Article $draftArticle;
    private Comment $comment;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles
        Role::findOrCreate('writer', 'web');
        Role::findOrCreate('student', 'web');
        Role::findOrCreate('editor', 'web');

        // Create users
        $this->student = User::factory()->create();
        $this->student->assignRole('student');

        $this->writer = User::factory()->create();
        $this->writer->assignRole('writer');

        // Create article statuses
        $publishedStatus = ArticleStatus::create([
            'name' => 'Published',
            'description' => 'Article is published',
        ]);

        $draftStatus = ArticleStatus::create([
            'name' => 'Draft',
            'description' => 'Article is in draft state',
        ]);

        // Create category
        $category = Category::create([
            'name' => 'Technology',
            'slug' => 'technology',
            'description' => 'Tech articles',
        ]);

        // Create published article
        $this->publishedArticle = Article::create([
            'title' => 'Published Article',
            'slug' => 'published-article',
            'content' => 'This is published content',
            'writer_id' => $this->writer->id,
            'category_id' => $category->id,
            'status_id' => $publishedStatus->id,
        ]);

        // Create draft article
        $this->draftArticle = Article::create([
            'title' => 'Draft Article',
            'slug' => 'draft-article',
            'content' => 'This is draft content',
            'writer_id' => $this->writer->id,
            'category_id' => $category->id,
            'status_id' => $draftStatus->id,
        ]);

        // Create a comment
        $this->comment = Comment::create([
            'article_id' => $this->publishedArticle->id,
            'student_id' => $this->student->id,
            'content' => 'Great article!',
        ]);
    }

    public function test_student_can_comment_on_published_article(): void
    {
        $this->assertTrue($this->student->can('create', [Comment::class, $this->publishedArticle]));
    }

    public function test_student_cannot_comment_on_draft_article(): void
    {
        $this->assertFalse($this->student->can('create', [Comment::class, $this->draftArticle]));
    }

    public function test_writer_cannot_comment(): void
    {
        $this->assertFalse($this->writer->can('create', [Comment::class, $this->publishedArticle]));
    }

    public function test_student_can_delete_own_comment(): void
    {
        $this->assertTrue($this->student->can('delete', $this->comment));
    }

    public function test_student_cannot_delete_other_comments(): void
    {
        $otherStudent = User::factory()->create();
        $otherStudent->assignRole('student');

        $this->assertFalse($otherStudent->can('delete', $this->comment));
    }

    public function test_writer_cannot_delete_comment(): void
    {
        $this->assertFalse($this->writer->can('delete', $this->comment));
    }
}
