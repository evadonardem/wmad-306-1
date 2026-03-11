<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('articles')->onDelete('cascade');
            $table->foreignId('editor_id')->constrained('users');
            $table->text('comments');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('revisions');
    }
};
