<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::firstOrCreate(['name' => 'writer']);
        Role::firstOrCreate(['name' => 'editor']);
        Role::firstOrCreate(['name' => 'student']);
    }
}
