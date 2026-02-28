<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Create permissions
        $permissions = [
            'create_article',
            'edit_own_article',
            'submit_article',
            'review_article',
            'request_revision',
            'publish_article',
            'comment_article',
            'delete_own_article',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission, 'guard_name' => 'web'],
                ['guard_name' => 'web']
            );
        }

        // Create Writer role
        $writer = Role::firstOrCreate(
            ['name' => 'writer', 'guard_name' => 'web'],
            ['name' => 'writer', 'guard_name' => 'web']
        );
        $writer->syncPermissions([
            'create_article',
            'edit_own_article',
            'submit_article',
            'delete_own_article',
        ]);

        // Create Editor role
        $editor = Role::firstOrCreate(
            ['name' => 'editor', 'guard_name' => 'web'],
            ['name' => 'editor', 'guard_name' => 'web']
        );
        $editor->syncPermissions([
            'review_article',
            'request_revision',
            'publish_article',
            'comment_article',
        ]);

        // Create Student role
        $student = Role::firstOrCreate(
            ['name' => 'student', 'guard_name' => 'web'],
            ['name' => 'student', 'guard_name' => 'web']
        );
        $student->syncPermissions([
            'comment_article',
        ]);
    }
}
