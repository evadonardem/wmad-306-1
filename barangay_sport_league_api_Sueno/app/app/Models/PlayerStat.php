<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlayerStat extends Model
{
    protected $fillable = [
        'game_id',
        'player_id',
        'points',
        'assists',
        'rebounds'
    ];
}
