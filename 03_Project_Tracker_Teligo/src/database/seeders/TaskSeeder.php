<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $projects = Project::all();

        foreach ($projects as $project) {
            Task::factory()
                ->count(rand(5, 10))
                ->create([
                    'project_id' => $project->id,
                ]);
        }
    }
}
