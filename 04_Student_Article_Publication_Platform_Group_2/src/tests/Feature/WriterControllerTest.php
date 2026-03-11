<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ArticleStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WriterControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // create roles so assignRole works
        \Spatie\Permission\Models\Role::create(['name'=>'writer']);
        \Spatie\Permission\Models\Role::create(['name'=>'editor']);
        \Spatie\Permission\Models\Role::create(['name'=>'student']);
        // ensure vite manifest has entries for our new Inertia pages (tests build often doesn't run vite)
        $manifestPath = base_path('public/build/manifest.json');
        if (file_exists($manifestPath)) {
            $manifest = json_decode(file_get_contents($manifestPath), true);
            $pages = [
                'resources/js/Pages/Writer/Dashboard.jsx',
                'resources/js/Pages/Editor/Dashboard.jsx',
                'resources/js/Pages/Editor/Review.jsx',
                'resources/js/Pages/Student/Dashboard.jsx',
            ];
            foreach ($pages as $page) {
                if (! isset($manifest[$page])) {
                    $manifest[$page] = [
                        'file' => 'assets/app.js',
                        'src' => $page,
                    ];
                }
            }
            file_put_contents($manifestPath, json_encode($manifest));
        }
    }
    public function test_writer_can_access_dashboard()
    {
        $user = User::factory()->create();
        $user->assignRole('writer');
        $response = $this->actingAs($user)->get(route('writer.dashboard'));
        $response->assertStatus(200);
    }

    public function test_writer_can_create_article()
    {
        $user = User::factory()->create();
        $user->assignRole('writer');
        $status = ArticleStatus::factory()->create(['name'=>'draft']);

        $category = \App\Models\Category::factory()->create();
        $response = $this->actingAs($user)->post(route('writer.articles.store'), [
            'title' => 'Test',
            'content' => 'Content',
            'category_id' => $category->id,
        ]);

        $response->assertRedirect(route('writer.dashboard'));
        $this->assertDatabaseHas('articles', ['title' => 'Test']);
    }

    public function test_writer_can_create_and_submit_article_directly()
    {
        $user = User::factory()->create();
        $user->assignRole('writer');
        ArticleStatus::factory()->create(['name' => 'submitted']);
        $category = \App\Models\Category::factory()->create();

        $response = $this->actingAs($user)->post(route('writer.articles.store'), [
            'title' => 'Submit Test',
            'content' => 'Content',
            'category_id' => $category->id,
            'submit' => true,
        ]);

        $response->assertRedirect(route('writer.dashboard'));
        $this->assertDatabaseHas('articles', ['title' => 'Submit Test']);

        $article = \App\Models\Article::where('title', 'Submit Test')->first();
        $this->assertEquals('submitted', $article->status->name);
    }

    public function test_writer_can_revise_their_article()
    {
        $user = User::factory()->create();
        $user->assignRole('writer');

        $status = ArticleStatus::factory()->create(['name' => 'draft']);
        $category = \App\Models\Category::factory()->create();

        $article = \App\Models\Article::factory()->create([
            'status_id' => $status->id,
            'writer_id' => $user->id,
            'category_id' => $category->id,
        ]);

        $response = $this->actingAs($user)->post(route('writer.articles.revise', $article->id), [
            'content' => 'Updated content',
        ]);

        $response->assertRedirect(route('writer.dashboard'));
        $this->assertEquals('Updated content', $article->fresh()->content);
    }
}
