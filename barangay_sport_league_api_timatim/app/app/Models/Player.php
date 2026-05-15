<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Player extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'birthdate',
        'position',
    ];

    protected $casts = [
        'birthdate' => 'date',
    ];

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'player_team')->withPivot('jersey_number');
    }

    public function playerStats()
    {
        return $this->hasMany(PlayerStat::class);
    }
}
