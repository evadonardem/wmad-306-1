<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $projects = Project::all();

        foreach ($projects as $project) {
            // create between 5 and 10 tasks per project
            Task::factory()->count(rand(5, 10))->create([
                'project_id' => $project->id,
                'user_id' => $project->user_id,
            ]);
        }
    }
}
