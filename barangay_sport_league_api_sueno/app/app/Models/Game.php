<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    protected $fillable = [
        'season_id',
        'team_a_id',
        'team_b_id',
        'game_date',
        'score_a',
        'score_b',
    ];

    public function stats()
    {
        return $this->hasMany(\App\Models\PlayerStat::class);
    }

    public function season()
    {
        return $this->belongsTo(\App\Models\Season::class);
    }

    public function homeTeam()
    {
        return $this->belongsTo(Team::class, 'team_a_id');
    }

    public function awayTeam()
    {
        return $this->belongsTo(Team::class, 'team_b_id');
    }
}