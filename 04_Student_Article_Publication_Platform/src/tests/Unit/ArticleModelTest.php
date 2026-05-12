<?php

namespace Tests\Unit;

use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleTest extends TestCase
{
    use RefreshDatabase;

    public function test_article_belongs_to_user()
    {
        $user = User::factory()->create();
        $article = Article::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $article->user);
        $this->assertEquals($user->id, $article->user->id);
    }

    public function test_article_has_fillable_attributes()
    {
        $user = User::factory()->create();
        $article = Article::create([
            'title' => 'Test Title',
            'content' => 'Test Content',
            'user_id' => $user->id,
            'status' => 'published',
        ]);

        $this->assertEquals('Test Title', $article->title);
        $this->assertEquals('Test Content', $article->content);
        $this->assertEquals('published', $article->status);
        $this->assertEquals($user->id, $article->user_id);
    }

    public function test_article_scopes()
    {
        $user = User::factory()->create();

        $draftArticle = Article::factory()->create([
            'user_id' => $user->id,
            'status' => 'draft'
        ]);

        $publishedArticle = Article::factory()->create([
            'user_id' => $user->id,
            'status' => 'published'
        ]);

        $this->assertEquals(1, Article::draft()->count());
        $this->assertEquals(1, Article::published()->count());
    }

    public function test_article_casts()
    {
        $user = User::factory()->create();
        $publishedAt = now();

        $article = Article::factory()->create([
            'user_id' => $user->id,
            'published_at' => $publishedAt,
        ]);

        $this->assertInstanceOf(\Carbon\Carbon::class, $article->published_at);
    }
}