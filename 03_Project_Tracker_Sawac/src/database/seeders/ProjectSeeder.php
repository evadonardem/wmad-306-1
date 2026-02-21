<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            $projects = Project::factory()->count(rand(5, 8))->create([
                'user_id' => $user->id,
            ]);

            foreach ($projects as $project) {
                // tasks will be created by TaskSeeder; keep here for convenience if needed
            }
        }
    }
}
