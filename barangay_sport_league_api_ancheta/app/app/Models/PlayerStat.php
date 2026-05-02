<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['points', 'assists', 'rebounds', 'fouls'])]
class PlayerStat extends Model
{
    use HasFactory;

    public function gameResult()
    {
        return $this->belongsTo(GameResult::class);
    }

    public function player()
    {
        return $this->belongsTo(Player::class);
    }

    public function game()
    {
        return $this->gameResult->game;
    }

    public function getTeamAttribute()
    {
        $game = $this->game();
        $playerTeam = $game->homeTeam->players()->where('player_id', $this->player_id)->first();

        if (!$playerTeam) {
            $playerTeam = $game->awayTeam->players()->where('player_id', $this->player_id)->first();
        }

        return $playerTeam ? ($playerTeam->pivot->team_id === $game->home_team_id ? $game->homeTeam : $game->awayTeam) : null;
    }
}
