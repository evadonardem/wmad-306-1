<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table): void {
            $table->index(['published_at', 'is_public'], 'articles_published_public_idx');
            $table->index(['article_status_id', 'published_at'], 'articles_status_published_idx');
            $table->index(['claimed_by_editor_id', 'published_at'], 'articles_claimed_published_idx');
            $table->index(['user_id', 'published_at'], 'articles_author_published_idx');
            $table->index(['category_id', 'published_at'], 'articles_category_published_idx');
            $table->index(['public_approved_by', 'public_approved_at'], 'articles_public_approver_idx');
        });

        Schema::table('comments', function (Blueprint $table): void {
            $table->index(['article_id', 'created_at'], 'comments_article_created_idx');
            $table->index(['parent_id', 'created_at'], 'comments_parent_created_idx');
            $table->index(['user_id', 'created_at'], 'comments_user_created_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table): void {
            $table->dropIndex('articles_published_public_idx');
            $table->dropIndex('articles_status_published_idx');
            $table->dropIndex('articles_claimed_published_idx');
            $table->dropIndex('articles_author_published_idx');
            $table->dropIndex('articles_category_published_idx');
            $table->dropIndex('articles_public_approver_idx');
        });

        Schema::table('comments', function (Blueprint $table): void {
            $table->dropIndex('comments_article_created_idx');
            $table->dropIndex('comments_parent_created_idx');
            $table->dropIndex('comments_user_created_idx');
        });
    }
};
