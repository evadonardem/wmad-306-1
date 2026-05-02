<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'start_date', 'end_date', 'status'])]
class Season extends Model
{
    use HasFactory;

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

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

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeDone($query)
    {
        return $query->where('status', 'done');
    }
}
