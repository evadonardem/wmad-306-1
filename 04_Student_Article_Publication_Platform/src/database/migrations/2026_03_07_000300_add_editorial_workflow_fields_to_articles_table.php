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
            $table->foreignId('claimed_by_editor_id')
                ->nullable()
                ->after('public_approved_at')
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('claimed_at')->nullable()->after('claimed_by_editor_id');
            $table->foreignId('rejected_by_editor_id')
                ->nullable()
                ->after('claimed_at')
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('rejected_at')->nullable()->after('rejected_by_editor_id');
            $table->text('editorial_decision_notes')->nullable()->after('rejected_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('claimed_by_editor_id');
            $table->dropConstrainedForeignId('rejected_by_editor_id');
            $table->dropColumn([
                'claimed_at',
                'rejected_at',
                'editorial_decision_notes',
            ]);
        });
    }
};
