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
            $table->unsignedInteger('points')->default(0);
            $table->unsignedInteger('assists')->default(0);
            $table->unsignedInteger('rebounds')->default(0);
            $table->unsignedInteger('fouls')->default(0);
            $table->timestamps();

            $table->unique(['game_result_id', 'player_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('player_stats');
    }
};
