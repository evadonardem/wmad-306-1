<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'manage accounts',
            'article.create',
            'article.submit',
            'article.revise',
            'article.review',
            'article.request-revision',
            'article.publish',
            'comment.create',
            'comment.moderate',
        ];

        foreach ($permissions as $permissionName) {
            Permission::query()->firstOrCreate(['name' => $permissionName]);
        }

        $adminRole = Role::query()->firstOrCreate(['name' => 'admin']);
        $writerRole = Role::query()->firstOrCreate(['name' => 'writer']);
        $editorRole = Role::query()->firstOrCreate(['name' => 'editor']);

        $adminRole->syncPermissions(Permission::query()->pluck('name')->all());
        $writerRole->syncPermissions(['article.create', 'article.submit', 'article.revise']);
        $editorRole->syncPermissions(['article.review', 'article.request-revision', 'article.publish', 'comment.moderate']);
    }
}
