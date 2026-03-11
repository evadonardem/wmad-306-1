<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition()
    {

        $articles = [

            ["title"=>"AI Transforming Higher Education","content"=>"Artificial Intelligence is transforming universities through adaptive learning systems and AI-powered academic tools."],

            ["title"=>"The Future of Renewable Energy","content"=>"Renewable energy innovations such as solar and wind technologies are becoming essential to sustainable development."],

            ["title"=>"Smart Campuses and Digital Learning","content"=>"Smart campuses integrate IoT devices and digital platforms to improve the student learning experience."],

            ["title"=>"Mental Health Support for University Students","content"=>"Universities are expanding counseling services and wellness initiatives to improve student wellbeing."],

            ["title"=>"Innovation in Sustainable Engineering","content"=>"Engineering researchers are developing sustainable technologies to reduce environmental impact."],

            ["title"=>"The Impact of Social Media on Student Life","content"=>"Social media influences student communication, collaboration, and information sharing."],

            ["title"=>"Entrepreneurship Among College Students","content"=>"University incubators and startup programs help students develop innovative business ideas."],

            ["title"=>"Advancing Healthcare Through Technology","content"=>"Healthcare technology innovations such as telemedicine and AI diagnostics are improving patient care."],

            ["title"=>"Climate Change Awareness in Universities","content"=>"Students and researchers are actively participating in sustainability initiatives."],

            ["title"=>"Digital Libraries and Academic Research","content"=>"Digital libraries allow students to access research materials from anywhere in the world."],

            ["title"=>"Cybersecurity Challenges in Higher Education","content"=>"Universities must strengthen cybersecurity as digital learning platforms expand."],

            ["title"=>"The Rise of Remote Learning","content"=>"Online education platforms have expanded access to learning across the world."],

            ["title"=>"Data Science in Academic Research","content"=>"Researchers are using data science techniques to analyze complex academic datasets."],

            ["title"=>"Sustainable Transportation on Campuses","content"=>"Electric vehicles and bike-sharing programs are reducing campus carbon footprints."],

            ["title"=>"Robotics in Modern Engineering","content"=>"Robotics research is driving automation and technological progress."],

        ];

        $article = $this->faker->randomElement($articles);

        // Prefer existing demo accounts and published status for sample data
        $demoWriter = User::where('email', 'test@gmail.com')->first();
        $publishedStatus = ArticleStatus::where('name', 'published')->first();

        return [

            'title' => $article['title'],

            'content' => $article['content'],

            'status_id' => $publishedStatus?->id ?? ArticleStatus::firstOrCreate(
                ['name' => 'published'],
                ['label' => 'Published']
            )->id,

            'writer_id' => $demoWriter?->id ?? User::factory(),

            'editor_id' => null,

            'category_id' => Category::inRandomOrder()->first()->id ?? Category::factory()->create()->id,

        ];
    }
}
