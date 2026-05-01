<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Player extends Model
{
    protected $fillable = ['name', 'birthdate', 'position'];

    protected function casts(): array
    {
        return [
            'birthdate' => 'date',
        ];
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'player_team')
            ->withPivot('jersey_number')
            ->withTimestamps();
    }

    public function stats(): HasMany
    {
        return $this->hasMany(PlayerStat::class);
    }
}
