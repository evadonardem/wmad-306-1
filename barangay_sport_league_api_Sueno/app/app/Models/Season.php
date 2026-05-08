<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Season extends Model
{
    protected $fillable = [
        'league_id',
        'name',
        'description',
    ];

    public function teams()
    {
        return $this->hasMany(\App\Models\Team::class);
    }

    public function league()
    {
        return $this->belongsTo(League::class);
    }
}
