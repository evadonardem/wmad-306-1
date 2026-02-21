<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $projects = Project::all();

        foreach ($projects as $project) {
            Task::factory()->count(rand(5, 8))->create([
                'project_id' => $project->id,
            ]);
        }
    }
}
