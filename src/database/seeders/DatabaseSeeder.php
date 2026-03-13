<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Revision;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Order matters to avoid foreign key errors:
     * 1. RoleSeeder        — creates roles & permissions (no FK dependencies)
     * 2. ArticleStatusSeeder — creates statuses (no FK dependencies)
     * 3. CategorySeeder    — creates categories (no FK dependencies)
     * 4. UserSeeder        — creates users and assigns roles (depends on roles)
     * 5. Sample data       — articles, revisions, comments (depends on all above)
     *
     * Seeded Accounts (password: "password"):
     * +----------------------+------------------+----------+
     * | Email                | Name             | Role     |
     * +----------------------+------------------+----------+
     * | writer@example.com   | John Writer      | writer   |
     * | editor@example.com   | Jane Editor      | editor   |
     * | student@example.com  | Bob Student      | student  |
     * +----------------------+------------------+----------+
     */
    public function run(): void
    {
        // 1. Seed roles & permissions
        $this->call(RoleSeeder::class);

        // 2. Seed article statuses (Draft, Submitted, Needs Revision, Published, Commented)
        $this->call(ArticleStatusSeeder::class);

        // 3. Seed categories (Technology, Business, Education, Science, Health)
        $this->call(CategorySeeder::class);

        // 4. Seed users with roles
        $this->call(UserSeeder::class);

        // 5. Generate sample articles, revisions, and comments
        $this->generateSampleData();
    }

    /**
     * Generate sample articles across various statuses,
     * with revisions and comments for realistic test data.
     */
    private function generateSampleData(): void
    {
        $writer = User::where('email', 'writer@example.com')->first();
        $editor = User::where('email', 'editor@example.com')->first();
        $student = User::where('email', 'student@example.com')->first();

        $categories = Category::all();
        $draftStatus = ArticleStatus::where('name', 'Draft')->first();
        $submittedStatus = ArticleStatus::where('name', 'Submitted')->first();
        $needsRevisionStatus = ArticleStatus::where('name', 'Needs Revision')->first();
        $publishedStatus = ArticleStatus::where('name', 'Published')->first();

        // ── Draft articles ──────────────────────────────────────────
        Article::create([
            'title' => 'Getting Started with Machine Learning in Python',
            'slug' => 'getting-started-with-machine-learning-in-python',
            'content' => '<p>Machine learning has become one of the most exciting fields in computer science. In this article, we will explore the basics of machine learning using Python and the popular scikit-learn library.</p><p>First, you need to understand the difference between supervised and unsupervised learning. Supervised learning uses labeled data to train models, while unsupervised learning discovers hidden patterns in unlabeled data.</p><p>Python makes it easy to get started thanks to libraries like NumPy, pandas, and scikit-learn. A simple workflow involves loading your dataset, splitting it into training and test sets, choosing a model, and evaluating its performance.</p>',
            'writer_id' => $writer->id,
            'category_id' => $categories->where('name', 'Technology')->first()->id,
            'status_id' => $draftStatus->id,
        ]);

        Article::create([
            'title' => 'The Benefits of Reading for Academic Success',
            'slug' => 'the-benefits-of-reading-for-academic-success',
            'content' => '<p>Reading is one of the most important habits a student can develop. Research consistently shows that students who read regularly perform better in all academic subjects, not just language arts.</p><p>When you read, you build vocabulary, improve comprehension skills, and develop critical thinking abilities. These skills transfer across every discipline, from history to science.</p>',
            'writer_id' => $writer->id,
            'category_id' => $categories->where('name', 'Education')->first()->id,
            'status_id' => $draftStatus->id,
        ]);

        // ── Submitted articles (waiting for editor review) ──────────
        Article::create([
            'title' => 'How Renewable Energy Is Changing the World',
            'slug' => 'how-renewable-energy-is-changing-the-world',
            'content' => '<p>Renewable energy sources such as solar, wind, and hydroelectric power are rapidly transforming the global energy landscape. As the cost of renewable technology continues to drop, more countries are investing in clean energy infrastructure.</p><p>Solar panels have become affordable for homeowners, and large-scale wind farms are powering entire cities. Electric vehicles are also driving demand for cleaner electricity generation.</p><p>The transition to renewable energy is not just an environmental necessity — it is also creating millions of new jobs worldwide and reducing dependence on fossil fuels.</p>',
            'writer_id' => $writer->id,
            'category_id' => $categories->where('name', 'Science')->first()->id,
            'status_id' => $submittedStatus->id,
        ]);

        Article::create([
            'title' => 'Understanding Financial Literacy for Students',
            'slug' => 'understanding-financial-literacy-for-students',
            'content' => '<p>Financial literacy is a crucial life skill that is often overlooked in traditional education. Understanding how to budget, save, and invest can set students up for long-term success.</p><p>A good starting point is the 50/30/20 rule: allocate 50% of your income to needs, 30% to wants, and 20% to savings. Even with a small income, practicing this habit early builds discipline.</p><p>Students should also learn about compound interest, credit scores, and the basics of investing. These concepts may seem complex at first, but they become intuitive with practice.</p>',
            'writer_id' => $writer->id,
            'category_id' => $categories->where('name', 'Business')->first()->id,
            'status_id' => $submittedStatus->id,
        ]);

        // ── Articles needing revision ───────────────────────────────
        $revisionArticle1 = Article::create([
            'title' => 'The Impact of Social Media on Mental Health',
            'slug' => 'the-impact-of-social-media-on-mental-health',
            'content' => '<p>Social media has become an integral part of modern life, especially for young people. While it offers many benefits such as staying connected with friends and accessing information, research suggests it can also have negative effects on mental health.</p><p>Studies have linked excessive social media use to increased anxiety, depression, and feelings of loneliness. The constant comparison with curated online personas can erode self-esteem.</p><p>However, social media is not inherently harmful. Setting healthy boundaries, such as limiting screen time and curating your feed, can help mitigate these effects.</p>',
            'writer_id' => $writer->id,
            'category_id' => $categories->where('name', 'Health')->first()->id,
            'status_id' => $needsRevisionStatus->id,
        ]);

        Revision::create([
            'article_id' => $revisionArticle1->id,
            'editor_id' => $editor->id,
            'feedback' => 'Good topic and structure! Please add specific statistics or cite studies to support your claims about anxiety and depression. Also, consider adding a section on positive uses of social media for academic collaboration.',
        ]);

        $revisionArticle2 = Article::create([
            'title' => 'Effective Study Techniques Every Student Should Know',
            'slug' => 'effective-study-techniques-every-student-should-know',
            'content' => '<p>Many students spend hours studying but still struggle with exams. The problem is often not the amount of time spent, but the techniques used. Research in cognitive science has identified several highly effective study methods.</p><p>Active recall — testing yourself on material rather than passively re-reading — is one of the most powerful techniques. Spaced repetition, where you review material at increasing intervals, helps cement knowledge in long-term memory.</p>',
            'writer_id' => $writer->id,
            'category_id' => $categories->where('name', 'Education')->first()->id,
            'status_id' => $needsRevisionStatus->id,
        ]);

        Revision::create([
            'article_id' => $revisionArticle2->id,
            'editor_id' => $editor->id,
            'feedback' => 'Great start! The article feels incomplete — please add at least two more study techniques (e.g., the Pomodoro method, interleaving). Also, a brief conclusion summarizing the key takeaways would strengthen the piece.',
        ]);

        // ── Published articles (visible to students) ────────────────
        $pub1 = Article::create([
            'title' => 'Introduction to Web Development: A Beginner\'s Guide',
            'slug' => 'introduction-to-web-development-a-beginners-guide',
            'content' => '<h2>What Is Web Development?</h2><p>Web development is the process of building and maintaining websites. It encompasses everything from creating simple static pages to complex web applications, social media platforms, and e-commerce sites.</p><h2>Frontend vs Backend</h2><p>Frontend development focuses on what users see and interact with — HTML for structure, CSS for styling, and JavaScript for interactivity. Backend development handles the server side: databases, authentication, and business logic, typically using languages like PHP, Python, or Node.js.</p><h2>Getting Started</h2><p>The best way to learn web development is by building projects. Start with a simple personal portfolio website using HTML and CSS. Then add JavaScript for interactivity. Once comfortable, explore a framework like React or Laravel to build full-stack applications.</p><p>Remember: every expert was once a beginner. Consistency and curiosity are your greatest assets on this journey.</p>',
            'writer_id' => $writer->id,
            'editor_id' => $editor->id,
            'category_id' => $categories->where('name', 'Technology')->first()->id,
            'status_id' => $publishedStatus->id,
        ]);

        $pub2 = Article::create([
            'title' => 'The Science Behind Climate Change',
            'slug' => 'the-science-behind-climate-change',
            'content' => '<h2>Understanding the Greenhouse Effect</h2><p>Climate change refers to long-term shifts in global temperatures and weather patterns. While natural factors like volcanic eruptions can influence climate, human activities — particularly burning fossil fuels — have been the primary driver since the Industrial Revolution.</p><h2>The Evidence</h2><p>Global average temperatures have risen by approximately 1.1°C since pre-industrial times. Ice cores, ocean temperature records, and satellite data all confirm this warming trend. The consequences include rising sea levels, more frequent extreme weather events, and disruptions to ecosystems.</p><h2>What Can Be Done?</h2><p>Addressing climate change requires both individual and collective action. Reducing carbon emissions, transitioning to renewable energy, improving energy efficiency, and protecting forests are all critical steps. International agreements like the Paris Accord set targets, but meeting them requires sustained effort from governments, businesses, and citizens alike.</p>',
            'writer_id' => $writer->id,
            'editor_id' => $editor->id,
            'category_id' => $categories->where('name', 'Science')->first()->id,
            'status_id' => $publishedStatus->id,
        ]);

        $pub3 = Article::create([
            'title' => 'Healthy Eating Habits for College Students',
            'slug' => 'healthy-eating-habits-for-college-students',
            'content' => '<h2>Why Nutrition Matters</h2><p>College life is demanding, and proper nutrition plays a vital role in maintaining energy, focus, and overall health. Unfortunately, many students rely on fast food and snacks due to busy schedules and tight budgets.</p><h2>Simple Tips for Better Eating</h2><p>Meal prepping on weekends can save time and money during the week. Focus on whole foods: fruits, vegetables, whole grains, and lean proteins. Keeping healthy snacks like nuts, yogurt, and fruit on hand reduces the temptation to reach for junk food.</p><p>Staying hydrated is equally important — aim for at least eight glasses of water per day. Reducing sugary drinks can significantly improve your energy levels and concentration.</p><h2>Balance, Not Perfection</h2><p>Healthy eating does not mean eliminating all treats. The goal is balance. Enjoy your favorite foods in moderation while making nutritious choices most of the time.</p>',
            'writer_id' => $writer->id,
            'editor_id' => $editor->id,
            'category_id' => $categories->where('name', 'Health')->first()->id,
            'status_id' => $publishedStatus->id,
        ]);

        $pub4 = Article::create([
            'title' => 'How to Build a Successful Startup While in School',
            'slug' => 'how-to-build-a-successful-startup-while-in-school',
            'content' => '<h2>The Student Entrepreneur</h2><p>Starting a business while still in school may seem daunting, but it offers unique advantages. You have access to mentors, a built-in network of peers, and often lower living costs than after graduation.</p><h2>Finding Your Idea</h2><p>The best startup ideas solve real problems. Look at the challenges you and your classmates face daily. Is there a service that could be improved? A tool that does not exist yet? Start by validating your idea — talk to potential customers before building anything.</p><h2>Managing Your Time</h2><p>Balancing academics and a startup requires discipline. Use time-blocking techniques, prioritize ruthlessly, and do not be afraid to delegate. Many successful founders started small, dedicating just a few hours per week to their venture.</p><p>Remember that failure is part of the process. Each setback teaches valuable lessons that no classroom can provide.</p>',
            'writer_id' => $writer->id,
            'editor_id' => $editor->id,
            'category_id' => $categories->where('name', 'Business')->first()->id,
            'status_id' => $publishedStatus->id,
        ]);

        // Add comments from student on published articles
        Comment::create([
            'article_id' => $pub1->id,
            'student_id' => $student->id,
            'content' => 'This is a great introduction! I started learning HTML last month and this article really helped me understand the bigger picture of web development.',
        ]);
        Comment::create([
            'article_id' => $pub1->id,
            'student_id' => $student->id,
            'content' => 'Would love a follow-up article that goes deeper into JavaScript frameworks like React!',
        ]);

        Comment::create([
            'article_id' => $pub2->id,
            'student_id' => $student->id,
            'content' => 'Very informative. The section on evidence was eye-opening. I had no idea ice cores could reveal so much about historical climate patterns.',
        ]);

        Comment::create([
            'article_id' => $pub3->id,
            'student_id' => $student->id,
            'content' => 'Meal prepping has been a game changer for me! I wish I had read this article at the start of the semester.',
        ]);
        Comment::create([
            'article_id' => $pub3->id,
            'student_id' => $student->id,
            'content' => 'The tip about staying hydrated is underrated. I noticed a huge difference in my focus after cutting out sugary drinks.',
        ]);

        Comment::create([
            'article_id' => $pub4->id,
            'student_id' => $student->id,
            'content' => 'This is really inspiring! I have been thinking about starting a small tutoring service on campus. The advice about time-blocking is exactly what I needed.',
        ]);

        // Revision history for a couple of published articles
        Revision::create([
            'article_id' => $pub1->id,
            'editor_id' => $editor->id,
            'feedback' => 'Please add a section explaining the difference between frontend and backend development more clearly.',
        ]);
        Revision::create([
            'article_id' => $pub2->id,
            'editor_id' => $editor->id,
            'feedback' => 'Consider including specific temperature data and mentioning the Paris Accord for context.',
        ]);
    }
}
