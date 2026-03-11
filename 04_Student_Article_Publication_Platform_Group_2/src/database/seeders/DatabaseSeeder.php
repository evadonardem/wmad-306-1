<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            CategorySeeder::class,
            ArticleStatusSeeder::class,
            UserSeeder::class,
            ArticleSeeder::class,
        ]);

        // Informational output for developers running seeds locally
        $writer = \App\Models\User::whereHas('roles', fn($q) => $q->where('name','writer'))->first();
        $editor = \App\Models\User::whereHas('roles', fn($q) => $q->where('name','editor'))->first();
        $student = \App\Models\User::whereHas('roles', fn($q) => $q->where('name','student'))->first();

        if ($this->command) {
            $this->command->info('Seeded demo accounts:');
            if ($writer) {
                $this->command->info('Writer: ' . $writer->email . ' / password: password');
            }
            if ($editor) {
                $this->command->info('Editor: ' . $editor->email . ' / password: password');
            }
            if ($student) {
                $this->command->info('Student: ' . $student->email . ' / password: password');
            }

            $this->command->info('To enable sample routes for testing, set ALLOW_SAMPLE_ROUTES=true in your local .env');
        }
    }
}
