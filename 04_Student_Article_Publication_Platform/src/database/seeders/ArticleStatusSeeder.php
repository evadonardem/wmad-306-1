<?php

namespace Database\Seeders;

use App\Models\ArticleStatus;
use Illuminate\Database\Seeder;

class ArticleStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['name' => 'Draft', 'slug' => 'draft'],
            ['name' => 'Submitted', 'slug' => 'submitted'],
            ['name' => 'Revision Requested', 'slug' => 'revision-requested'],
            ['name' => 'Rejected', 'slug' => 'rejected'],
            ['name' => 'Published', 'slug' => 'published'],
        ];

        foreach ($statuses as $status) {
            ArticleStatus::query()->firstOrCreate(['slug' => $status['slug']], $status);
        }
    }
}
