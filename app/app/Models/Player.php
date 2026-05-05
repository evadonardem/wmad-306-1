<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    protected $fillable = ['name', 'birthdate', 'position'];

    public function teams()
    {
        return $this->belongsToMany(Team::class, 'player_team')
                    ->withPivot('jersey_number');
    }

    public function stats()
    {
        return $this->hasMany(PlayerStat::class);
    }
}
