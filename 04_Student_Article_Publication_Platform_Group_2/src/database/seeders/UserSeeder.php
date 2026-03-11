<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure base roles exist (useful when seeding only this file)
        foreach (['writer', 'editor', 'student'] as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        // writers
        $writer = User::firstOrCreate([
            'email' => 'writer@example.com',
        ], [
            'name' => 'Writer User',
            'password' => bcrypt('password'),
        ]);
        $writer->assignRole('writer');

        // editors
        $editor = User::firstOrCreate([
            'email' => 'editor@example.com',
        ], [
            'name' => 'Editor User',
            'password' => bcrypt('password'),
        ]);
        $editor->assignRole('editor');

        // students
        $student = User::firstOrCreate([
            'email' => 'student@example.com',
        ], [
            'name' => 'Student User',
            'password' => bcrypt('password'),
        ]);
        $student->assignRole('student');

        // demo user for quick role switching (writer/editor/student)
        $demo = User::firstOrCreate([
            'email' => 'test@gmail.com',
        ], [
            'name' => 'Demo User',
            'password' => bcrypt('ispassword'),
        ]);
        $demo->syncRoles(['writer', 'editor', 'student']);
    }
}
