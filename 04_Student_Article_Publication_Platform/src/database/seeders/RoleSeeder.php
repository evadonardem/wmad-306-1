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
        $guard = config('auth.defaults.guard', 'web');

        $permissions = [
            'manage accounts',
            'article.create',
            'article.submit',
            'article.revise',
            'article.review',
            'article.request-revision',
            'article.publish',
            'article.approve-public',
            'comment.create',
            'comment.moderate',
        ];

        foreach ($permissions as $permissionName) {
            Permission::findOrCreate($permissionName, $guard);
        }

        $adminRole = Role::findOrCreate('admin', $guard);
        $writerRole = Role::findOrCreate('writer', $guard);
        $editorRole = Role::findOrCreate('editor', $guard);
        Role::findOrCreate('student', $guard);

        $adminRole->syncPermissions(Permission::query()->pluck('name')->all());
        $writerRole->syncPermissions(['article.create', 'article.submit', 'article.revise']);
        $editorRole->syncPermissions(['article.review', 'article.request-revision', 'article.publish', 'article.approve-public', 'comment.moderate']);
    }
}
