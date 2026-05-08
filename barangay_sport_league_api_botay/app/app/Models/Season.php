<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Season extends Model
{
    /** @use HasFactory */
    use HasFactory;

    protected $fillable = [
        'league_id',
        'name',
        'year',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Get the league this season belongs to
     */
    public function league(): BelongsTo
    {
        return $this->belongsTo(League::class);
    }

    /**
     * Get all teams in this season
     */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'season_team')
            ->withPivot('wins', 'losses')
            ->withTimestamps();
    }

    /**
     * Get all games in this season
     */
    public function games(): HasMany
    {
        return $this->hasMany(Game::class);
    }
}
