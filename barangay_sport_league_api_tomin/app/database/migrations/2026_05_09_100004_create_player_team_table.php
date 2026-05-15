<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('player_team', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('player_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('jersey_number'); // 0–99

            $table->timestamps();

            // A player can only be on a team once
            $table->unique(['team_id', 'player_id']);
            // A jersey number can only be used once per team
            $table->unique(['team_id', 'jersey_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('player_team');
    }
};
