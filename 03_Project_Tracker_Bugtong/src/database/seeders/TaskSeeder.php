<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Project::all()->each(function ($project) {
            \App\Models\Task::factory()->count(5)->create([
                'project_id' => $project->id
            ]);
        });
    }
}
