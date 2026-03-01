<?php

namespace Database\Seeders;

use App\Models\ArticleStatus;
use Illuminate\Database\Seeder;

class ArticleStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            ['name' => 'draft', 'label' => 'Draft'],
            ['name' => 'pending_review', 'label' => 'Submitted'],
            ['name' => 'needs_revision', 'label' => 'Needs Revision'],
            ['name' => 'published', 'label' => 'Published'],
        ];

        foreach ($statuses as $status) {
            ArticleStatus::firstOrCreate(['name' => $status['name']], $status);
        }
    }
}
