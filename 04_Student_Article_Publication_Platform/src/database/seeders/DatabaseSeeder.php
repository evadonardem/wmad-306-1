<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Call seeders in proper order
        $this->call(RoleSeeder::class);
        $this->call(ArticleStatusSeeder::class);
        $this->call(CategorySeeder::class);

        // Create a writer user (idempotent)
        $writer = User::firstOrCreate(
            ['email' => 'writer@example.com'],
            [
                'name' => 'John Writer',
                'password' => bcrypt('password'),
            ]
        );
        // Sync role to avoid duplicate role assignments
        $writer->syncRoles(['writer']);

        // Create an editor user (idempotent)
        $editor = User::firstOrCreate(
            ['email' => 'editor@example.com'],
            [
                'name' => 'Jane Editor',
                'password' => bcrypt('password'),
            ]
        );
        $editor->syncRoles(['editor']);

        // Create a student user (idempotent)
        $student = User::firstOrCreate(
            ['email' => 'student@example.com'],
            [
                'name' => 'Bob Student',
                'password' => bcrypt('password'),
            ]
        );
        $student->syncRoles(['student']);
    }
}
