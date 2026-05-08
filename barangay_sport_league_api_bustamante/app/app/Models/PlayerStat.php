<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlayerStat extends Model
{
    protected $fillable = [
        'game_result_id',
        'player_id',
        'points',
        'assists',
        'rebounds',
        'fouls',
    ];

    public function result(): BelongsTo
    {
        return $this->belongsTo(GameResult::class, 'game_result_id');
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }
}
