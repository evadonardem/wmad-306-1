<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // relationships

    public function writtenArticles()
    {
        return $this->hasMany(Article::class, 'writer_id');
    }

    public function editedArticles()
    {
        return $this->hasMany(Article::class, 'editor_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'student_id');
    }

    public function revisions()
    {
        return $this->hasMany(Revision::class, 'editor_id');
    }

    public function favorites()
    {
        return $this->hasMany(ArticleFavorite::class);
    }

    public function favoriteArticles()
    {
        return $this->belongsToMany(Article::class, 'article_favorites');
    }
}
