<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Player extends Model
{
    /** @use HasFactory */
    use HasFactory;

    protected $fillable = [
        'team_id',
        'name',
        'jersey_number',
        'position',
        'height_cm',
        'contact',
    ];

    protected $casts = [
        'height_cm' => 'integer',
        'jersey_number' => 'integer',
    ];

    /**
     * Get the team this player belongs to
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get all stats for this player
     */
    public function stats(): HasMany
    {
        return $this->hasMany(PlayerStats::class);
    }
}
