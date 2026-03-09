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
        'category_id',
        'writer_id',
        'editor_id'
    ];

    // Belongs to a Writer (User)
    public function writer()
    {
        return $this->belongsTo(User::class, 'writer_id');
    }

    // Belongs to an Editor (User)
    public function editor()
    {
        return $this->belongsTo(User::class, 'editor_id');
    }

    // Belongs to a Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Belongs to an ArticleStatus
    public function status()
    {
        return $this->belongsTo(ArticleStatus::class, 'status_id');
    }

    // Has many Revisions
    public function revisions()
    {
        return $this->hasMany(Revision::class);
    }

    // Has many Comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Helper method recommended by Instructional Guidance
    public function isPublished()
    {
        return $this->status->name === 'published';
    }
}
