<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Category;
use App\Models\Comment;
use App\Models\EditorialActionLog;
use App\Models\Revision;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EditorReviewQueueSeeder extends Seeder
{
    /**
     * Seed deterministic review-queue demo data for editor workflow testing.
     */
    public function run(): void
    {
        $editor = User::query()->firstOrCreate(
            ['email' => 'editor@example.com'],
            [
                'name' => 'Editor User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'account_status' => 'active',
            ]
        );
        $editor->syncRoles(['editor']);

        $student = User::query()->firstOrCreate(
            ['email' => 'student@example.com'],
            [
                'name' => 'Student User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'account_status' => 'active',
            ]
        );
        $student->syncRoles(['student']);

        $writerOne = User::query()->firstOrCreate(
            ['email' => 'writer@example.com'],
            [
                'name' => 'Writer User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'account_status' => 'active',
            ]
        );
        $writerOne->syncRoles(['writer']);

        $writerTwo = User::query()->firstOrCreate(
            ['email' => 'writer2@example.com'],
            [
                'name' => 'Second Writer',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'account_status' => 'active',
            ]
        );
        $writerTwo->syncRoles(['writer']);

        $submittedStatusId = ArticleStatus::query()->where('slug', 'submitted')->value('id');
        $publishedStatusId = ArticleStatus::query()->where('slug', 'published')->value('id');
        $revisionRequestedStatusId = ArticleStatus::query()->where('slug', 'revision-requested')->value('id');

        if (! $submittedStatusId || ! $publishedStatusId) {
            return;
        }

        $categoryId = Category::query()->orderBy('id')->value('id');
        if (! $categoryId) {
            $categoryId = Category::query()->create([
                'name' => 'General',
                'slug' => 'general',
            ])->id;
        }

        // Recreate only this specific demo dataset to keep reruns deterministic.
        Article::query()->where('slug', 'like', 'editor-queue-demo-%')->delete();

        $definitions = [
            // Unclaimed queue entries.
            [
                'slug' => 'editor-queue-demo-unclaimed-1',
                'title' => 'Campus Food Waste Reduction Plan',
                'content' => 'Analysis of cafeteria waste trends and a practical reduction framework for student-led adoption.',
                'user_id' => $writerOne->id,
                'article_status_id' => $submittedStatusId,
                'submitted_at' => now()->subHours(14),
                'published_at' => null,
                'claimed_by_editor_id' => null,
                'claimed_at' => null,
                'is_public' => false,
            ],
            [
                'slug' => 'editor-queue-demo-unclaimed-2',
                'title' => 'Night Library Utilization Study',
                'content' => 'Survey-backed findings on late-hour library usage, safety concerns, and scheduling recommendations.',
                'user_id' => $writerTwo->id,
                'article_status_id' => $submittedStatusId,
                'submitted_at' => now()->subHours(10),
                'published_at' => null,
                'claimed_by_editor_id' => null,
                'claimed_at' => null,
                'is_public' => false,
            ],
            [
                'slug' => 'editor-queue-demo-unclaimed-3',
                'title' => 'Affordable Transit for Commuter Students',
                'content' => 'A policy proposal focused on route gaps, fare burden, and timetable synchronization with class blocks.',
                'user_id' => $writerOne->id,
                'article_status_id' => $submittedStatusId,
                'submitted_at' => now()->subHours(8),
                'published_at' => null,
                'claimed_by_editor_id' => null,
                'claimed_at' => null,
                'is_public' => false,
            ],
            [
                'slug' => 'editor-queue-demo-unclaimed-4',
                'title' => 'Student Internship Outcome Benchmark',
                'content' => 'Comparative report on internship placement timelines, conversion rates, and mentorship quality indicators.',
                'user_id' => $writerTwo->id,
                'article_status_id' => $submittedStatusId,
                'submitted_at' => now()->subHours(6),
                'published_at' => null,
                'claimed_by_editor_id' => null,
                'claimed_at' => null,
                'is_public' => false,
            ],

            // Claimed by editor and currently in review.
            [
                'slug' => 'editor-queue-demo-claimed-1',
                'title' => 'Open Lab Access and Equipment Scheduling',
                'content' => 'Editorial draft describing bottlenecks in lab booking and a revised slot model for equitable access.',
                'user_id' => $writerOne->id,
                'article_status_id' => $submittedStatusId,
                'submitted_at' => now()->subHours(18),
                'published_at' => null,
                'claimed_by_editor_id' => $editor->id,
                'claimed_at' => now()->subHours(4),
                'is_public' => false,
            ],
            [
                'slug' => 'editor-queue-demo-claimed-2',
                'title' => 'Dorm Energy Conservation Pilot',
                'content' => 'Pilot metrics and interview insights on student participation in daily dorm energy-saving practices.',
                'user_id' => $writerTwo->id,
                'article_status_id' => $submittedStatusId,
                'submitted_at' => now()->subHours(16),
                'published_at' => null,
                'claimed_by_editor_id' => $editor->id,
                'claimed_at' => now()->subHours(2),
                'is_public' => false,
            ],

            // Published but not public yet (for public approval testing).
            [
                'slug' => 'editor-queue-demo-published-internal-1',
                'title' => 'Peer Tutoring Program Expansion Results',
                'content' => 'Post-publication report on tutoring engagement growth and measurable GPA trend movement.',
                'user_id' => $writerOne->id,
                'article_status_id' => $publishedStatusId,
                'submitted_at' => now()->subDays(3),
                'published_at' => now()->subDays(2),
                'claimed_by_editor_id' => null,
                'claimed_at' => null,
                'is_public' => false,
            ],
            [
                'slug' => 'editor-queue-demo-published-internal-2',
                'title' => 'Digital Wellness Practices on Campus',
                'content' => 'Feature article on screen-time habits, intervention pilots, and student-led accountability models.',
                'user_id' => $writerTwo->id,
                'article_status_id' => $publishedStatusId,
                'submitted_at' => now()->subDays(2),
                'published_at' => now()->subDay(),
                'claimed_by_editor_id' => null,
                'claimed_at' => null,
                'is_public' => false,
            ],

            // Published and public (for public listing validation).
            [
                'slug' => 'editor-queue-demo-published-public-1',
                'title' => 'Student Research Showcase Highlights',
                'content' => 'Curated summary of notable projects from this semester research showcase.',
                'user_id' => $writerOne->id,
                'article_status_id' => $publishedStatusId,
                'submitted_at' => now()->subDays(5),
                'published_at' => now()->subDays(4),
                'claimed_by_editor_id' => null,
                'claimed_at' => null,
                'is_public' => true,
                'public_approved_by' => $editor->id,
                'public_approved_at' => now()->subDays(4),
            ],
            [
                'slug' => 'editor-queue-demo-published-public-2',
                'title' => 'Community Service Week Impact Report',
                'content' => 'Participation metrics and reflective outcomes from community service activities.',
                'user_id' => $writerTwo->id,
                'article_status_id' => $publishedStatusId,
                'submitted_at' => now()->subDays(4),
                'published_at' => now()->subDays(3),
                'claimed_by_editor_id' => null,
                'claimed_at' => null,
                'is_public' => true,
                'public_approved_by' => $editor->id,
                'public_approved_at' => now()->subDays(3),
            ],
        ];

        $created = collect($definitions)->map(function (array $row) use ($categoryId) {
            return Article::query()->create([
                'user_id' => $row['user_id'],
                'category_id' => $categoryId,
                'article_status_id' => $row['article_status_id'],
                'title' => $row['title'],
                'slug' => $row['slug'],
                'content' => $row['content'],
                'submitted_at' => $row['submitted_at'],
                'published_at' => $row['published_at'],
                'claimed_by_editor_id' => $row['claimed_by_editor_id'] ?? null,
                'claimed_at' => $row['claimed_at'] ?? null,
                'is_public' => $row['is_public'] ?? false,
                'public_approved_by' => $row['public_approved_by'] ?? null,
                'public_approved_at' => $row['public_approved_at'] ?? null,
            ]);
        });

        // Seed initial editorial audit trail rows so Admin can validate accountability UI immediately.
        foreach ($created as $article) {
            if ($article->claimed_by_editor_id) {
                EditorialActionLog::query()->create([
                    'article_id' => $article->id,
                    'article_title' => $article->title,
                    'acting_user_id' => $editor->id,
                    'acting_role' => 'editor',
                    'action' => 'claimed_for_review',
                    'previous_status' => 'submitted',
                    'new_status' => 'submitted',
                    'note' => null,
                    'meta' => ['claimed_at' => optional($article->claimed_at)?->toISOString()],
                    'created_at' => now()->subHours(2),
                    'updated_at' => now()->subHours(2),
                ]);
            }

            if ($article->published_at) {
                EditorialActionLog::query()->create([
                    'article_id' => $article->id,
                    'article_title' => $article->title,
                    'acting_user_id' => $editor->id,
                    'acting_role' => 'editor',
                    'action' => 'accepted_and_published',
                    'previous_status' => 'submitted',
                    'new_status' => 'published',
                    'note' => null,
                    'meta' => ['published_at' => optional($article->published_at)?->toISOString()],
                    'created_at' => now()->subHours(1),
                    'updated_at' => now()->subHours(1),
                ]);
            }
        }

        // Add one revision trail entry for a claimed article.
        $claimedArticle = $created->firstWhere('slug', 'editor-queue-demo-claimed-1');
        if ($claimedArticle) {
            Revision::factory()->create([
                'article_id' => $claimedArticle->id,
                'requested_by' => $editor->id,
                'notes' => 'Please tighten the intro and cite the source for utilization percentages.',
            ]);
        }

        // Add comments on one public and one internal published article.
        $publicArticle = $created->firstWhere('slug', 'editor-queue-demo-published-public-1');
        $internalArticle = $created->firstWhere('slug', 'editor-queue-demo-published-internal-1');
        if ($publicArticle) {
            Comment::factory()->create([
                'article_id' => $publicArticle->id,
                'user_id' => $student->id,
                'body' => 'Very informative. Can you share the full dataset methodology?',
            ]);
        }
        if ($internalArticle) {
            Comment::factory()->create([
                'article_id' => $internalArticle->id,
                'user_id' => $editor->id,
                'body' => 'Ready for final public approval after title tweak.',
            ]);
        }

        // Optional revision-requested sample tied to queue testing.
        if ($revisionRequestedStatusId) {
            Article::query()->create([
                'user_id' => $writerOne->id,
                'category_id' => $categoryId,
                'article_status_id' => $revisionRequestedStatusId,
                'title' => 'Editor Queue Demo: Revision Requested Sample',
                'slug' => 'editor-queue-demo-revision-requested-1',
                'content' => 'This sample remains in revision-requested state to validate writer follow-up paths.',
                'submitted_at' => now()->subDays(2),
                'published_at' => null,
                'is_public' => false,
                'editorial_decision_notes' => 'Clarify section 2 and provide citation for chart assumptions.',
            ]);
        }
    }
}
