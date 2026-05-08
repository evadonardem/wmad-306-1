<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameResult extends Model
{
    protected $fillable = ['game_id', 'home_score', 'away_score'];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    public function playerStats()
    {
        return $this->hasMany(PlayerStat::class);
    }
}