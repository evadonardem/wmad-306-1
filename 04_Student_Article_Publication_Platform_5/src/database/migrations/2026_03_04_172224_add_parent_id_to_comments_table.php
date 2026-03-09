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
            // Adds the parent_id column right after article_id
            $table->unsignedBigInteger('parent_id')->nullable()->after('article_id');

            // Tells the database that parent_id references another comment's ID
            $table->foreign('parent_id')->references('id')->on('comments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            // Drops the foreign key and the column if we ever need to rollback
            $table->dropForeign(['parent_id']);
            $table->dropColumn('parent_id');
        });
    }
};
