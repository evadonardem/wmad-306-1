<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'writer']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'editor']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'student']);
    }

    public function test_student_can_comment_on_published_article()
    {
        $student = User::factory()->create();
        $student->assignRole('student');

        $writer = User::factory()->create();
        $writer->assignRole('writer');

        $statusPublished = ArticleStatus::factory()->create(['name' => 'published']);

        $article = Article::factory()->create([
            'status_id' => $statusPublished->id,
            'writer_id' => $writer->id,
        ]);

        $response = $this->actingAs($student)->post(route('student.articles.comment', $article->id), [
            'content' => 'Great article!',
        ]);

        $response->assertRedirect(route('student.dashboard'));
        $this->assertDatabaseHas('comments', [
            'article_id' => $article->id,
            'student_id' => $student->id,
            'content' => 'Great article!',
        ]);
    }
}
