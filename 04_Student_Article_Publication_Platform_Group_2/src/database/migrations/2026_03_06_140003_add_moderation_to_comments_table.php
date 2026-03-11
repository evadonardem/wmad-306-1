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
        Schema::table('comments', function (Blueprint $table) {
            $table->enum('status', ['approved', 'flagged', 'rejected'])->default('approved')->comment('Moderation status of comment');
            $table->text('moderation_reason')->nullable()->comment('Reason for flagging or rejection');
            $table->boolean('is_pinned')->default(false)->comment('Whether comment is pinned by editor');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropColumn(['status', 'moderation_reason', 'is_pinned']);
        });
    }
};
