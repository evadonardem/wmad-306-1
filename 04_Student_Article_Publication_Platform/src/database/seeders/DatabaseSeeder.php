<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create permissions
        Permission::create(['name' => 'view articles']);
        Permission::create(['name' => 'create articles']);
        Permission::create(['name' => 'edit articles']);
        Permission::create(['name' => 'delete articles']);
        Permission::create(['name' => 'publish articles']);

        // Create roles and assign permissions
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        $teacherRole = Role::create(['name' => 'teacher']);
        $teacherRole->givePermissionTo(['view articles', 'create articles', 'edit articles', 'delete articles', 'publish articles']);

        $studentRole = Role::create(['name' => 'student']);
        $studentRole->givePermissionTo(['view articles', 'create articles', 'edit articles', 'delete articles']);

        // Create users
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@wmad-306.edu.ph',
        ]);
        $admin->assignRole('admin');

        $teacher = User::factory()->create([
            'name' => 'Teacher User',
            'email' => 'teacher@wmad-306.edu.ph',
        ]);
        $teacher->assignRole('teacher');

        $student = User::factory()->create([
            'name' => 'Student User',
            'email' => 'student@wmad-306.edu.ph',
        ]);
        $student->assignRole('student');

        // Create some sample articles
        \App\Models\Article::factory()->create([
            'title' => 'Welcome to the Article Platform',
            'content' => '<p>This is a sample article to demonstrate the platform\'s capabilities.</p><p>You can create rich content with formatting, images, and more!</p>',
            'user_id' => $student->id,
            'status' => 'published',
            'published_at' => now(),
        ]);

        \App\Models\Article::factory()->create([
            'title' => 'Getting Started Guide',
            'content' => '<h2>Introduction</h2><p>Learn how to use this platform effectively.</p><h3>Creating Articles</h3><p>Use the rich text editor to format your content.</p>',
            'user_id' => $teacher->id,
            'status' => 'published',
            'published_at' => now(),
        ]);
    }
}
