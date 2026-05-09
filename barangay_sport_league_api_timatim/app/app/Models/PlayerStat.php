<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlayerStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_result_id',
        'player_id',
        'points',
        'assists',
        'rebounds',
        'fouls',
    ];

    public function gameResult()
    {
        return $this->belongsTo(GameResult::class);
    }

    public function player()
    {
        return $this->belongsTo(Player::class);
    }
}
