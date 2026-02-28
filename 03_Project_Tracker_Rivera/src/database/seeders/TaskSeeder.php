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
        Project::all()->each(function (Project $project): void {
            Task::factory()
                ->count(rand(5, 10))
                ->create([
                    'user_id' => $project->user_id,
                    'project_id' => $project->id,
                ]);
        });
    }
}
