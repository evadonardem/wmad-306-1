<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('season_id');
            $table->foreignId('home_team_id');
            $table->foreignId('away_team_id');
            $table->dateTime('scheduled_at');
            $table->string('venue');
            $table->enum('status', ['scheduled', 'done'])->default('scheduled');
            $table->timestamps();

            $table->unique(['season_id', 'home_team_id', 'away_team_id', 'scheduled_at'], 'unique_game_matchup');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
