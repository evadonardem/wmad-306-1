<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class EditorWorkflowRestrictionsTest extends TestCase
{
    use RefreshDatabase;

    private function prepareEditorialAccess(User $editor): void
    {
        $role = Role::query()->firstOrCreate(['name' => 'editor', 'guard_name' => 'web']);
        $manageAccounts = Permission::query()->firstOrCreate(['name' => 'manage accounts', 'guard_name' => 'web']);
        $publish = Permission::query()->firstOrCreate(['name' => 'article.publish', 'guard_name' => 'web']);
        $requestRevision = Permission::query()->firstOrCreate(['name' => 'article.request-revision', 'guard_name' => 'web']);
        $approvePublic = Permission::query()->firstOrCreate(['name' => 'article.approve-public', 'guard_name' => 'web']);

        $role->givePermissionTo([$publish, $requestRevision, $approvePublic, $manageAccounts]);
        $editor->assignRole('editor');
    }

    private function makeSubmittedArticle(User $author): Article
    {
        $status = ArticleStatus::query()->firstOrCreate(['slug' => 'submitted'], ['name' => 'Submitted']);
        $category = Category::query()->firstOrCreate(['slug' => 'general'], ['name' => 'General']);

        return Article::factory()->create([
            'user_id' => $author->id,
            'category_id' => $category->id,
            'article_status_id' => $status->id,
            'submitted_at' => now(),
            'published_at' => null,
        ]);
    }

    public function test_editor_cannot_claim_own_submission(): void
    {
        $editor = User::factory()->create();
        $this->prepareEditorialAccess($editor);
        $article = $this->makeSubmittedArticle($editor);

        $response = $this->actingAs($editor)
            ->post(route('editor.articles.claim', $article));

        $response->assertSessionHas('error');
        $this->assertNull($article->fresh()->claimed_by_editor_id);
    }

    public function test_editor_cannot_publish_article_without_claiming_it_first(): void
    {
        $editor = User::factory()->create();
        $this->prepareEditorialAccess($editor);
        $author = User::factory()->create();
        $article = $this->makeSubmittedArticle($author);

        $response = $this->actingAs($editor)
            ->post(route('editor.articles.publish', $article));

        $response->assertSessionHas('error');
        $this->assertNull($article->fresh()->published_at);
    }
}
