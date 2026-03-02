<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            ['name' => 'Admin User', 'email' => 'admin@example.com', 'role' => 'admin'],
            ['name' => 'Writer User', 'email' => 'writer@example.com', 'role' => 'writer'],
            ['name' => 'Editor User', 'email' => 'editor@example.com', 'role' => 'editor'],
            ['name' => 'Student User', 'email' => 'student@example.com', 'role' => 'student'],
        ];

        foreach ($users as $seedUser) {
            $user = User::query()->firstOrCreate(
                ['email' => $seedUser['email']],
                [
                    'name' => $seedUser['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'account_status' => 'active',
                    'suspended_at' => null,
                ]
            );

            $user->syncRoles([$seedUser['role']]);
        }
    }
}
