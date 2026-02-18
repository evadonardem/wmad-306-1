<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->each(function (User $user): void {
            Project::factory()
                ->count(random_int(5, 10))
                ->create(['user_id' => $user->id]);
        });
    }
}
