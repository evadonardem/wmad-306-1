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
            $table->foreignId('article_id')->constrained()->cascadeOnDelete();
            $table->foreignId('editor_id')->constrained('users')->cascadeOnDelete();
            $table->text('comments');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('revisions');
    }
};
