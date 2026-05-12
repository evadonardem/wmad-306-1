<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_article()
    {
        $user = User::factory()->create();
        $user->assignRole('student');

        $articleData = [
            'title' => 'Test Article',
            'content' => '<p>This is a test article content.</p>',
            'status' => 'draft',
        ];

        $response = $this->actingAs($user)
            ->post(route('articles.store'), $articleData);

        $response->assertRedirect();
        $this->assertDatabaseHas('articles', [
            'title' => 'Test Article',
            'user_id' => $user->id,
            'status' => 'draft',
        ]);
    }

    public function test_user_can_view_own_articles()
    {
        $user = User::factory()->create();
        $user->assignRole('student');

        $article = Article::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->get(route('articles.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('articles.data', 1)
            ->where('articles.data.0.title', $article->title)
        );
    }

    public function test_user_cannot_view_others_articles()
    {
        $user1 = User::factory()->create();
        $user1->assignRole('student');

        $user2 = User::factory()->create();
        $user2->assignRole('student');

        $article = Article::factory()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1)
            ->get(route('articles.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('articles.data', 0)
        );
    }

    public function test_teacher_can_view_all_articles()
    {
        $teacher = User::factory()->create();
        $teacher->assignRole('teacher');

        $student = User::factory()->create();
        $student->assignRole('student');

        $article = Article::factory()->create(['user_id' => $student->id]);

        $response = $this->actingAs($teacher)
            ->get(route('articles.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('articles.data', 1)
            ->where('articles.data.0.title', $article->title)
        );
    }

    public function test_article_validation()
    {
        $user = User::factory()->create();
        $user->assignRole('student');

        $response = $this->actingAs($user)
            ->post(route('articles.store'), [
                'title' => '',
                'content' => '',
                'status' => 'invalid',
            ]);

        $response->assertSessionHasErrors(['title', 'content', 'status']);
    }
}