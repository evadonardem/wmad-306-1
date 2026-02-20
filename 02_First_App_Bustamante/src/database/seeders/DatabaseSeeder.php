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
        User::factory(100)->create();

        User::factory()->create([
            'first_name' => 'Test',
            'last_name' => 'User',
            'gender' => ['male', 'female'][array_rand(['male', 'female'])], // random gender
            'email' => 'test@example.com',
            // optional: set a password if your factory doesn't handle it
            'password' => bcrypt('password123'),
        ]);
    }
}
