<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'coach'])]
class Team extends Model
{
    use HasFactory;

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

    public function homeGames()
    {
        return $this->hasMany(Game::class, 'home_team_id');
    }

    public function awayGames()
    {
        return $this->hasMany(Game::class, 'away_team_id');
    }

    public function allGames()
    {
        return Game::where(function($query) {
            $query->where('home_team_id', $this->id)
                  ->orWhere('away_team_id', $this->id);
        });
    }
}
