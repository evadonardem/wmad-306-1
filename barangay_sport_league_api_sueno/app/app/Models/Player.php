<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    protected $fillable = [
        'name',
        'birthdate',
        'position',
    ];

    public function stats()
    {
        return $this->hasMany(\App\Models\PlayerStat::class);
    }

    public function teams()
    {
        return $this->belongsToMany(\App\Models\Team::class)
            ->withPivot('jersey_number');
    }
}