<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CommentPostingTest extends TestCase
{
    use RefreshDatabase;

    private function makePublishedArticle(bool $isPublic = true): Article
    {
        $publishedStatus = ArticleStatus::query()->firstOrCreate(
            ['slug' => 'published'],
            ['name' => 'Published']
        );

        $author = User::factory()->create();
        $category = Category::query()->firstOrCreate(
            ['slug' => 'general'],
            ['name' => 'General']
        );

        return Article::factory()->create([
            'user_id' => $author->id,
            'category_id' => $category->id,
            'article_status_id' => $publishedStatus->id,
            'published_at' => now(),
            'is_public' => $isPublic,
        ]);
    }

    public function test_authenticated_student_can_comment_on_published_article(): void
    {
        Role::query()->firstOrCreate(['name' => 'student', 'guard_name' => 'web']);
        $student = User::factory()->create();
        $student->assignRole('student');
        $article = $this->makePublishedArticle();

        $response = $this->actingAs($student)->post(route('public.articles.comment', $article), [
            'body' => 'Great write-up, very useful.',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('comments', [
            'article_id' => $article->id,
            'user_id' => $student->id,
            'body' => 'Great write-up, very useful.',
        ]);
    }

    public function test_comment_with_link_is_rejected(): void
    {
        Role::query()->firstOrCreate(['name' => 'student', 'guard_name' => 'web']);
        $student = User::factory()->create();
        $student->assignRole('student');
        $article = $this->makePublishedArticle();

        $response = $this->actingAs($student)
            ->from('/articles/'.$article->id)
            ->post(route('public.articles.comment', $article), [
                'body' => 'Check this link http://spam.example',
            ]);

        $response->assertSessionHasErrors('body');
    }

    public function test_guest_cannot_comment(): void
    {
        $article = $this->makePublishedArticle();
        $response = $this->post(route('public.articles.comment', $article), [
            'body' => 'I am a guest comment',
        ]);

        $response->assertRedirect('/login');
        $this->assertDatabaseCount('comments', 0);
    }
}
