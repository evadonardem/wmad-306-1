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
            // create between 5 and 10 projects per user
            Project::factory()->count(rand(5, 10))->create([
                'user_id' => $user->id,
            ]);
        }
    }
}
