<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::fakctory()->count(5)->create();
        $users->each(
            Fn (User $user) => Project::factory()
            ->count(3)
            ->create(['user_id' => $user->id,])
        );
    }
}
