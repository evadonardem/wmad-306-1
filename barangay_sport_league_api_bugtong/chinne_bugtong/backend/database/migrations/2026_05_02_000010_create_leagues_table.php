<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(){
        Schema::create('leagues', function(Blueprint $table){
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('sport')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }
    public function down(){ Schema::dropIfExists('leagues'); }
};
