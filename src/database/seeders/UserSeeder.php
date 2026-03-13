<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Seed at least one user per role for testing.
     *
     * Seeded Accounts:
     * +-----------------------+------------------+----------+
     * | Email                 | Name             | Role     |
     * +-----------------------+------------------+----------+
     * | writer@example.com    | John Writer      | writer   |
     * | editor@example.com    | Jane Editor      | editor   |
     * | student@example.com   | Bob Student      | student  |
     * +-----------------------+------------------+----------+
     * Password for all: password
     */
    public function run(): void
    {
        // Create a writer user (idempotent)
        $writer = User::firstOrCreate(
            ['email' => 'writer@example.com'],
            [
                'name' => 'John Writer',
                'password' => bcrypt('password'),
            ]
        );
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
