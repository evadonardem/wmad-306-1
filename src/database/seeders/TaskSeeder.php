<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        Project::query()->each(function (Project $project): void {
            Task::factory()
                ->count(random_int(5, 10))
                ->create(['project_id' => $project->id]);
        });
    }
}
