<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clean up for reruns
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        \App\Models\Task::truncate();
        \App\Models\Project::truncate();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        \App\Models\User::all()->each(function ($user) {
            $projects = \App\Models\Project::factory()
                ->count(rand(5, 10))
                ->create([
                    'user_id' => $user->id,
                ]);
            foreach ($projects as $project) {
                \App\Models\Task::factory()->count(5)->create([
                    'project_id' => $project->id
                ]);
            }
        });
    }
}
