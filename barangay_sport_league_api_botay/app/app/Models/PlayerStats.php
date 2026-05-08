<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlayerStats extends Model
{
    /** @use HasFactory */
    use HasFactory;

    protected $table = 'player_stats';

    protected $fillable = [
        'player_id',
        'game_id',
        'points',
        'rebounds',
        'assists',
        'steals',
        'blocks',
        'fouls',
    ];

    protected $casts = [
        'points' => 'integer',
        'rebounds' => 'integer',
        'assists' => 'integer',
        'steals' => 'integer',
        'blocks' => 'integer',
        'fouls' => 'integer',
    ];

    /**
     * Get the player these stats belong to
     */
    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    /**
     * Get the game these stats belong to
     */
    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }
}
