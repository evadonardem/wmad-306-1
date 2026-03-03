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
            $table->boolean('is_public')->default(false)->after('published_at')->index();
            $table->foreignId('public_approved_by')->nullable()->after('is_public')->constrained('users')->nullOnDelete();
            $table->timestamp('public_approved_at')->nullable()->after('public_approved_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('public_approved_by');
            $table->dropColumn(['is_public', 'public_approved_at']);
        });
    }
};
