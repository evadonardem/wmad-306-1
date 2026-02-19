<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_shows_projects_and_tasks()
    {
        $user = User::factory()->create();

        $project = Project::factory()->for($user)->create(['title' => 'Alpha']);
        $task = Task::factory()->for($project)->create(['title' => 'First task']);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertSee('Alpha');
        $response->assertSee('First task');
    }
}
