<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create an Editor
        $editor = User::firstOrCreate(
            ['email' => 'editor@test.com'],
            ['name' => 'Alice Editor', 'password' => Hash::make('password')]
        );
        $editor->assignRole('editor');

        // 2. Create a Writer
        $writer = User::firstOrCreate(
            ['email' => 'writer@test.com'],
            ['name' => 'Bob Writer', 'password' => Hash::make('password')]
        );
        $writer->assignRole('writer');

        // 3. Create a Student
        $student = User::firstOrCreate(
            ['email' => 'student@test.com'],
            ['name' => 'Charlie Student', 'password' => Hash::make('password')]
        );
        $student->assignRole('student');
    }
}
