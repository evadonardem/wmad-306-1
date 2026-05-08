<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'sport', 'description'])]
class League extends Model
{
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function seasons()
    {
        return $this->hasMany(Season::class);
    }

    public function teams()
    {
        return $this->hasManyThrough(Team::class, Season::class);
    }
}
