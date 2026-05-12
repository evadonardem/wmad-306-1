<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ArticleCreationTest extends DuskTestCase
{
    use DatabaseMigrations;

    public function test_user_can_create_article_through_browser()
    {
        $user = User::factory()->create();
        $user->assignRole('student');

        $this->browse(function (Browser $browser) use ($user) {
            $browser->loginAs($user)
                ->visit('/dashboard')
                ->clickLink('New Article')
                ->waitForRoute('articles.create')
                ->type('title', 'My Test Article')
                ->script("document.querySelector('.jodit-editor__editor').innerHTML = '<p>This is the content of my test article.</p>'")
                ->select('status', 'published')
                ->press('Create Article')
                ->waitForRoute('articles.show')
                ->assertSee('My Test Article')
                ->assertSee('This is the content of my test article');
        });
    }

    public function test_user_can_edit_article()
    {
        $user = User::factory()->create();
        $user->assignRole('student');

        $article = \App\Models\Article::factory()->create([
            'user_id' => $user->id,
            'title' => 'Original Title',
            'content' => '<p>Original content</p>',
        ]);

        $this->browse(function (Browser $browser) use ($user, $article) {
            $browser->loginAs($user)
                ->visit(route('articles.edit', $article))
                ->type('title', 'Updated Title')
                ->script("document.querySelector('.jodit-editor__editor').innerHTML = '<p>Updated content</p>'")
                ->press('Update Article')
                ->waitForRoute('articles.show')
                ->assertSee('Updated Title')
                ->assertSee('Updated content');
        });
    }
}