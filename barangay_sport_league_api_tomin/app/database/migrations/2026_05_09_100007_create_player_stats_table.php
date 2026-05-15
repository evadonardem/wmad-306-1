<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('player_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_result_id')->constrained()->cascadeOnDelete();
            $table->foreignId('player_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('points')->default(0);
            $table->unsignedSmallInteger('assists')->default(0);
            $table->unsignedSmallInteger('rebounds')->default(0);
            $table->unsignedTinyInteger('fouls')->default(0); // max 6
            $table->timestamps();

            // One stat row per player per game result
            $table->unique(['game_result_id', 'player_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('player_stats');
    }
};
