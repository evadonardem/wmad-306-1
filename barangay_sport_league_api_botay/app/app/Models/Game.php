<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    /** @use HasFactory */
    use HasFactory;

    protected $fillable = [
        'season_id',
        'home_team_id',
        'away_team_id',
        'scheduled_at',
        'location',
        'status',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
    ];

    /**
     * Get the season this game belongs to
     */
    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class);
    }

    /**
     * Get the home team for this game
     */
    public function homeTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'home_team_id');
    }

    /**
     * Get the away team for this game
     */
    public function awayTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'away_team_id');
    }

    /**
     * Get the result for this game
     */
    public function result(): HasOne
    {
        return $this->hasOne(GameResult::class);
    }

    /**
     * Get all player stats for this game
     */
    public function playerStats(): HasMany
    {
        return $this->hasMany(PlayerStats::class);
    }
}
