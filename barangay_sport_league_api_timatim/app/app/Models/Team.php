<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'season_id',
        'name',
        'coach',
    ];

    public function season()
    {
        return $this->belongsTo(Season::class);
    }

    public function players(): BelongsToMany
    {
        return $this->belongsToMany(Player::class, 'player_team')->withPivot('jersey_number');
    }

    public function homeGames()
    {
        return $this->hasMany(Game::class, 'home_team_id');
    }

    public function awayGames()
    {
        return $this->hasMany(Game::class, 'away_team_id');
    }
}
