<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get articles written by this user
     */
    public function writtenArticles(): HasMany
    {
        return $this->hasMany(Article::class, 'writer_id');
    }

    /**
     * Get articles edited by this user
     */
    public function editedArticles(): HasMany
    {
        return $this->hasMany(Article::class, 'editor_id');
    }

    /**
     * Get revisions created by this user
     */
    public function revisions(): HasMany
    {
        return $this->hasMany(Revision::class, 'editor_id');
    }

    /**
     * Get comments created by this user
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'student_id');
    }
}
