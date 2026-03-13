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
            $table->string('slug')->unique();
            $table->longText('content');
            $table->unsignedBigInteger('writer_id');
            $table->unsignedBigInteger('editor_id')->nullable();
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('status_id');
            $table->timestamps();
            $table->softDeletes();

            // Foreign key constraints
            $table->foreign('writer_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('editor_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('category_id')->references('id')->on('categories')->cascadeOnDelete();
            $table->foreign('status_id')->references('id')->on('article_statuses')->cascadeOnDelete();

            // Indexes for performance
            $table->index('writer_id');
            $table->index('editor_id');
            $table->index('category_id');
            $table->index('status_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
