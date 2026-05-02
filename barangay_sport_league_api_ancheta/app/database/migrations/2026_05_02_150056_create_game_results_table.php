<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->onDelete('cascade');
            $table->integer('home_score');
            $table->integer('away_score');
            $table->timestamps();

            $table->unique('game_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_results');
    }
};
