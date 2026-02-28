<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Technology',
                'slug' => 'technology',
                'description' => 'Articles about technology and software development',
            ],
            [
                'name' => 'Business',
                'slug' => 'business',
                'description' => 'Business and entrepreneurship articles',
            ],
            [
                'name' => 'Education',
                'slug' => 'education',
                'description' => 'Educational content and learning resources',
            ],
            [
                'name' => 'Science',
                'slug' => 'science',
                'description' => 'Scientific research and discoveries',
            ],
            [
                'name' => 'Health',
                'slug' => 'health',
                'description' => 'Health and wellness articles',
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
