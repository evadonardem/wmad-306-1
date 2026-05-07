<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leagues', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::table('seasons', function (Blueprint $table) {
            $table->foreign('league_id')->references('id')->on('leagues')->cascadeOnDelete();
        });

        Schema::table('teams', function (Blueprint $table) {
            $table->foreign('season_id')->references('id')->on('seasons')->cascadeOnDelete();
        });

        Schema::table('games', function (Blueprint $table) {
            $table->foreign('season_id')->references('id')->on('seasons')->cascadeOnDelete();
            $table->foreign('home_team_id')->references('id')->on('teams')->cascadeOnDelete();
            $table->foreign('away_team_id')->references('id')->on('teams')->cascadeOnDelete();
        });

        Schema::table('game_results', function (Blueprint $table) {
            $table->foreign('game_id')->references('id')->on('games')->cascadeOnDelete();
        });

        Schema::table('player_stats', function (Blueprint $table) {
            $table->foreign('game_result_id')->references('id')->on('game_results')->cascadeOnDelete();
            $table->foreign('player_id')->references('id')->on('players')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('player_stats', function (Blueprint $table) {
            $table->dropForeign(['game_result_id']);
            $table->dropForeign(['player_id']);
        });

        Schema::table('game_results', function (Blueprint $table) {
            $table->dropForeign(['game_id']);
        });

        Schema::table('games', function (Blueprint $table) {
            $table->dropForeign(['season_id']);
            $table->dropForeign(['home_team_id']);
            $table->dropForeign(['away_team_id']);
        });

        Schema::table('teams', function (Blueprint $table) {
            $table->dropForeign(['season_id']);
        });

        Schema::table('seasons', function (Blueprint $table) {
            $table->dropForeign(['league_id']);
        });

        Schema::table('leagues', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });
    }
};
