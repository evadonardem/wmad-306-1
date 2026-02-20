<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the authenticated user or create a test user
        $user = User::first() ?? User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@example.com',
        ]);

        // Create 5 projects with tasks
        Project::factory(5)
            ->for($user)
            ->create()
            ->each(function (Project $project) {
                // Create 5-10 tasks for each project
                Task::factory(rand(5, 10))->for($project)->create();
            });
    }
}
