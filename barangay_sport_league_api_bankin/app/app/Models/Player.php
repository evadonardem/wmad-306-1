<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'birthdate', 'position'];

    public function teams()
    {
        return $this->belongsToMany(Team::class, 'player_team')
                    ->withPivot('jersey_number')
                    ->withTimestamps();
    }
}
