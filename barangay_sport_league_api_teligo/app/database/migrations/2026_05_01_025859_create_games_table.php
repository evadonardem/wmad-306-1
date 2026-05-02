<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('season_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('home_team_id');
            $table->unsignedBigInteger('away_team_id');
            $table->foreign('home_team_id')->references('id')->on('teams')->cascadeOnDelete();
            $table->foreign('away_team_id')->references('id')->on('teams')->cascadeOnDelete();
            $table->dateTime('scheduled_at');
            $table->string('venue');
            $table->enum('status', ['scheduled', 'done'])->default('scheduled');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('games');
    }
};