<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all projects
        $projects = Project::all();

        // Create 5-10 tasks for each project
        foreach ($projects as $project) {
            Task::factory()
                ->count(rand(5, 10))
                ->create([
                    'project_id' => $project->id,
                ]);
        }
    }
}
