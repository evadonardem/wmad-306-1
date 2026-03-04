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
        // Ensure roles/permissions are created under the active auth guard.
        $guard = config('auth.defaults.guard', 'web');

        $permissions = [
            'manage accounts',
            'article.create',
            'article.submit',
            'article.revise',
            'article.review',
            'article.request-revision',
            'article.publish',
            // Permission for approving homepage/public visibility.
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
        // Keep student role present for role-based routing and access checks.
        Role::findOrCreate('student', $guard);

        $adminRole->syncPermissions(Permission::query()->pluck('name')->all());
        $writerRole->syncPermissions(['article.create', 'article.submit', 'article.revise']);
        $editorRole->syncPermissions(['article.review', 'article.request-revision', 'article.publish', 'article.approve-public', 'comment.moderate']);
    }
}
