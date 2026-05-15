<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = ['season_id', 'name', 'coach'];

    public function season()
    {
        return $this->belongsTo(Season::class);
    }

    public function players()
    {
        return $this->belongsToMany(Player::class, 'player_team')
                    ->withPivot('jersey_number')
                    ->withTimestamps();
    }
}
