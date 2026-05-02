<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(){
        Schema::create('games', function(Blueprint $table){
            $table->id();
            $table->foreignId('season_id')->constrained()->cascadeOnDelete();
            $table->foreignId('home_team_id')->constrained('teams')->cascadeOnDelete();
            $table->foreignId('away_team_id')->constrained('teams')->cascadeOnDelete();
            $table->timestamp('scheduled_at')->nullable();
            $table->string('venue')->nullable();
            $table->enum('status',['scheduled','done'])->default('scheduled');
            $table->timestamps();
        });
    }
    public function down(){ Schema::dropIfExists('games'); }
};
