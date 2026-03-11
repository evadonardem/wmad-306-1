<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'content',
        'status_id',
        'writer_id',
        'editor_id',
        'category_id',
    ];

    public function status()
    {
        return $this->belongsTo(ArticleStatus::class);
    }

    public function writer()
    {
        return $this->belongsTo(User::class, 'writer_id');
    }

    public function editor()
    {
        return $this->belongsTo(User::class, 'editor_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function revisions()
    {
        return $this->hasMany(Revision::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function favorites()
    {
        return $this->hasMany(ArticleFavorite::class);
    }

    // helper
    public function isPublished()
    {
        return $this->status && $this->status->name === 'published';
    }
}
