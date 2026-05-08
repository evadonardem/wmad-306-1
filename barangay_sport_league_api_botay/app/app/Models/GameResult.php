<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameResult extends Model
{
    /** @use HasFactory */
    use HasFactory;

    protected $fillable = [
        'game_id',
        'home_team_score',
        'away_team_score',
    ];

    protected $casts = [
        'home_team_score' => 'integer',
        'away_team_score' => 'integer',
    ];

    /**
     * Get the game this result belongs to
     */
    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }
}
