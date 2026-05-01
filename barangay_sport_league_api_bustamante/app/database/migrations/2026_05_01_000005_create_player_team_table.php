<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('player_team', function (Blueprint $table) {
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('player_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('jersey_number');
            $table->timestamps();

            $table->primary(['team_id', 'player_id']);
            $table->unique(['team_id', 'jersey_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('player_team');
    }
};
