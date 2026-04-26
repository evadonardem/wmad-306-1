<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'article.create',
            'article.edit.own',
            'article.delete.own',
            'article.view.any',
            'article.approve',
            'user.approve',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $writerRole = Role::firstOrCreate(['name' => 'writer', 'guard_name' => 'web']);
        $studentRole = Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']);

        $adminRole->syncPermissions($permissions);
        $writerRole->syncPermissions([
            'article.create',
            'article.edit.own',
            'article.delete.own',
            'article.view.any',
        ]);
        $studentRole->syncPermissions([
            'article.view.any',
        ]);

        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Platform Admin',
                'password' => Hash::make('password'),
                'is_approved' => true,
            ]
        );
        $admin->syncRoles([$adminRole->name]);

        $writer = User::updateOrCreate(
            ['email' => 'writer@example.com'],
            [
                'name' => 'Sample Writer',
                'password' => Hash::make('password'),
                'is_approved' => false,
            ]
        );
        $writer->syncRoles([$writerRole->name]);

        $student = User::updateOrCreate(
            ['email' => 'student@example.com'],
            [
                'name' => 'Sample Student',
                'password' => Hash::make('password'),
                'is_approved' => true,
            ]
        );
        $student->syncRoles([$studentRole->name]);
    }
}
