<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class League extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'sport',
        'description',
    ];

    // 🔥 relationship to user
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function seasons()
    {
        return $this->hasMany(Season::class);
    }
}