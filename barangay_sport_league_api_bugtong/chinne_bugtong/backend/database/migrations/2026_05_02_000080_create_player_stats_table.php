<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(){
        Schema::create('player_stats', function(Blueprint $table){
            $table->id();
            $table->foreignId('game_result_id')->constrained('game_results')->cascadeOnDelete();
            $table->foreignId('player_id')->constrained()->cascadeOnDelete();
            $table->integer('points')->default(0);
            $table->integer('assists')->default(0);
            $table->integer('rebounds')->default(0);
            $table->integer('fouls')->default(0);
            $table->timestamps();
        });
    }
    public function down(){ Schema::dropIfExists('player_stats'); }
};
