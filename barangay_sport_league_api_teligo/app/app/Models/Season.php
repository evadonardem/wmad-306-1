<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Season extends Model
{
    protected $fillable = ['league_id', 'name', 'start_date', 'end_date', 'status'];

    public function league()
    {
        return $this->belongsTo(League::class);
    }

    public function teams()
    {
        return $this->hasMany(Team::class);
    }

    public function games()
    {
        return $this->hasMany(Game::class);
    }
}