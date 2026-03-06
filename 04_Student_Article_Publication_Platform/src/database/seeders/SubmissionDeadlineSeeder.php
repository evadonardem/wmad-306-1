<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\SubmissionDeadline;
use Illuminate\Database\Seeder;

class SubmissionDeadlineSeeder extends Seeder
{
    public function run(): void
    {
        $techId = Category::query()->where('slug', 'technology')->value('id');
        $scienceId = Category::query()->where('slug', 'science')->value('id');

        $deadlines = [
            [
                'title' => 'Weekly submission cutoff',
                'category_id' => null,
                'due_at' => now()->addDays(3)->setTime(17, 0),
                'active' => true,
            ],
            [
                'title' => 'Technology column deadline',
                'category_id' => $techId,
                'due_at' => now()->addDays(7)->setTime(12, 0),
                'active' => true,
            ],
            [
                'title' => 'Science feature deadline',
                'category_id' => $scienceId,
                'due_at' => now()->addDays(10)->setTime(12, 0),
                'active' => true,
            ],
        ];

        foreach ($deadlines as $d) {
            SubmissionDeadline::query()->firstOrCreate(
                ['title' => $d['title'], 'due_at' => $d['due_at']],
                $d
            );
        }
    }
}
