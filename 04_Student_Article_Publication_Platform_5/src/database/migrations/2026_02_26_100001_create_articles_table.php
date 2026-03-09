<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->longText('content');

            // Foreign Keys required by Rubric
            $table->foreignId('status_id')->constrained('article_statuses');
            $table->foreignId('category_id')->constrained('categories');
            $table->foreignId('writer_id')->constrained('users')->cascadeOnDelete();

            // editor_id is nullable because a draft hasn't been assigned an editor yet
            $table->foreignId('editor_id')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes(); // Rubric requirement: Implement soft deletes
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
