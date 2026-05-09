<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameResult extends Model
{
    protected $fillable = ['game_id', 'home_score', 'away_score'];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function playerStats(): HasMany
    {
        return $this->hasMany(PlayerStat::class);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    public function winnerSide(): string
    {
        if ($this->home_score > $this->away_score) {
            return 'home';
        }
        if ($this->away_score > $this->home_score) {
            return 'away';
        }
        return 'draw';
    }
}
