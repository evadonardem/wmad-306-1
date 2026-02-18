<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // create a test user with known credentials and some additional users
        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        //     'password' => bcrypt('password'),
        // ]);

        // create additional users
        // User::factory()->count(4)->create();

        // seed projects and tasks
        $this->call([
            ProjectSeeder::class,
            TaskSeeder::class,
        ]);
    }
}
