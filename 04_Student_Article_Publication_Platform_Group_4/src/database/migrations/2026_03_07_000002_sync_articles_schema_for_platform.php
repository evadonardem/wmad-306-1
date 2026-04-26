<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('articles')) {
            return;
        }

        Schema::table('articles', function (Blueprint $table) {
            if (! Schema::hasColumn('articles', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained()->nullOnDelete();
            }

            if (! Schema::hasColumn('articles', 'title')) {
                $table->string('title')->after('user_id');
            }

            if (! Schema::hasColumn('articles', 'content')) {
                $table->longText('content')->nullable()->after('title');
            }

            if (! Schema::hasColumn('articles', 'status')) {
                $table->string('status')->default('pending')->after('content');
            }

            if (! Schema::hasColumn('articles', 'reviewed_by')) {
                $table->foreignId('reviewed_by')->nullable()->after('status')->constrained('users')->nullOnDelete();
            }

            if (! Schema::hasColumn('articles', 'reviewed_at')) {
                $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            }

            if (! Schema::hasColumn('articles', 'created_at') && ! Schema::hasColumn('articles', 'updated_at')) {
                $table->timestamps();
            }
        });

        // Legacy schemas often used ENUM('draft','published'). Convert to VARCHAR
        // before remapping values to avoid SQL truncation errors in strict mode.
        DB::statement("ALTER TABLE articles MODIFY status VARCHAR(20) NOT NULL DEFAULT 'pending'");

        // Normalize legacy status values used by older seeders/workflows.
        DB::table('articles')->where('status', 'published')->update(['status' => 'approved']);
        DB::table('articles')->where('status', 'draft')->update(['status' => 'pending']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally left empty: compatibility migration should be non-destructive.
    }
};
