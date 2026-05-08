<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameResult extends Model
{
    protected $fillable = ['game_id', 'home_score', 'away_score'];

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function playerStats(): HasMany
    {
        return $this->hasMany(PlayerStat::class);
    }
}
