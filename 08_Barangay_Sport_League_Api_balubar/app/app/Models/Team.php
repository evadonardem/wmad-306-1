<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = ['season_id', 'name', 'coach'];

    public function season()
    {
        return $this->belongsTo(Season::class);
    }

    public function players()
    {
        return $this->belongsToMany(Player::class, 'player_team')
                    ->withPivot('jersey_number');
    }
}
