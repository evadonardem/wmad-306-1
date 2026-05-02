<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'birthdate', 'position'])]
class Player extends Model
{
    use HasFactory;

    protected $casts = [
        'birthdate' => 'date',
    ];

    public function teams()
    {
        return $this->belongsToMany(Team::class, 'player_team')
            ->withPivot('jersey_number')
            ->withTimestamps();
    }

    public function playerStats()
    {
        return $this->hasMany(PlayerStat::class);
    }

    public function getTotalPointsAttribute()
    {
        return $this->playerStats()->sum('points');
    }

    public function getTotalAssistsAttribute()
    {
        return $this->playerStats()->sum('assists');
    }

    public function getTotalReboundsAttribute()
    {
        return $this->playerStats()->sum('rebounds');
    }

    public function getGamesPlayedAttribute()
    {
        return $this->playerStats()->count();
    }
}
