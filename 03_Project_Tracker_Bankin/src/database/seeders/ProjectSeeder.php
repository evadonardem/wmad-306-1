<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Project::factory()->count(15)->create()->each(function ($project) {
            // Create 5 tasks for each project
            Task::factory()->count(5)->create(['project_id' => $project->id]);
            $project->calculateProgress();
        });
    }
}
