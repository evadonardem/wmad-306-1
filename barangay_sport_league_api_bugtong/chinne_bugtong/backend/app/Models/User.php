<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = ['name','email','password'];

    protected $hidden = ['password'];

    public function leagues(): HasMany
    {
        return $this->hasMany(League::class);
    }

    public function seasons(): HasManyThrough
    {
        return $this->hasManyThrough(Season::class, League::class);
    }
}
