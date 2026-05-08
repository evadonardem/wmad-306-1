<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['scheduled_at', 'venue', 'status'])]
class Game extends Model
{
    use HasFactory;

    protected $casts = [
        'scheduled_at' => 'datetime',
    ];

    public function season()
    {
        return $this->belongsTo(Season::class);
    }

    public function homeTeam()
    {
        return $this->belongsTo(Team::class, 'home_team_id');
    }

    public function awayTeam()
    {
        return $this->belongsTo(Team::class, 'away_team_id');
    }

    public function gameResult()
    {
        return $this->hasOne(GameResult::class);
    }

    public function playerStats()
    {
        return $this->hasManyThrough(PlayerStat::class, GameResult::class);
    }

    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    public function scopeDone($query)
    {
        return $query->where('status', 'done');
    }

    public function isCompleted()
    {
        return $this->status === 'done' && $this->gameResult;
    }
}
