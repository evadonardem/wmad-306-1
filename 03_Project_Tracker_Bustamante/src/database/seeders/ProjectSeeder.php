<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::query()
            ->get()
            ->each(function (User $user) {
                Project::factory()
                    ->count(7)
                    ->for($user)
                    ->create();
            });
    }
}
