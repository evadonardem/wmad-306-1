<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('revisions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('article_id');
            $table->unsignedBigInteger('editor_id');
            $table->text('feedback');
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('article_id')->references('id')->on('articles')->cascadeOnDelete();
            $table->foreign('editor_id')->references('id')->on('users')->cascadeOnDelete();

            // Indexes for performance
            $table->index('article_id');
            $table->index('editor_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('revisions');
    }
};
