<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = [
        'season_id',
        'name',
        'coach',
    ];

    public function season()
    {
        return $this->belongsTo(\App\Models\Season::class);
    }

    public function players()
    {
        return $this->belongsToMany(\App\Models\Player::class)
            ->withPivot('jersey_number');
    }
}