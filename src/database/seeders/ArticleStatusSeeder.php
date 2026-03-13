<?php

namespace Database\Seeders;

use App\Models\ArticleStatus;
use Illuminate\Database\Seeder;

class ArticleStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            [
                'name' => 'Draft',
                'description' => 'Article is in draft state and not yet submitted',
            ],
            [
                'name' => 'Submitted',
                'description' => 'Article has been submitted for review',
            ],
            [
                'name' => 'Needs Revision',
                'description' => 'Editor has requested revisions',
            ],
            [
                'name' => 'Published',
                'description' => 'Article has been published and is visible to readers',
            ],
            [
                'name' => 'Commented',
                'description' => 'Article is published and has comments',
            ],
        ];

        foreach ($statuses as $status) {
            ArticleStatus::updateOrCreate(
                ['name' => $status['name']],
                $status
            );
        }
    }
}
