<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class League extends Model
{
    protected $fillable = ['user_id', 'name', 'sport', 'description'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function seasons()
    {
        return $this->hasMany(Season::class);
    }
}