<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['home_score', 'away_score'])]
class GameResult extends Model
{
    use HasFactory;

    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    public function playerStats()
    {
        return $this->hasMany(PlayerStat::class);
    }

    public function getWinnerAttribute()
    {
        if ($this->home_score > $this->away_score) {
            return $this->game->homeTeam;
        } elseif ($this->away_score > $this->home_score) {
            return $this->game->awayTeam;
        }
        return null; // Draw
    }

    public function getLoserAttribute()
    {
        if ($this->home_score < $this->away_score) {
            return $this->game->homeTeam;
        } elseif ($this->away_score < $this->home_score) {
            return $this->game->awayTeam;
        }
        return null; // Draw
    }

    public function isDraw()
    {
        return $this->home_score === $this->away_score;
    }
}
