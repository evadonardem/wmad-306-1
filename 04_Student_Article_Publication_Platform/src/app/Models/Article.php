<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'writer_id',
        'editor_id',
        'category_id',
        'status_id',
    ];

    public function writer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'writer_id');
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'editor_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(ArticleStatus::class, 'status_id');
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(Revision::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Check if article is published
     */
    public function isPublished(): bool
    {
        return $this->status()->where('name', 'Published')->exists();
    }

    /**
     * Check if article needs revision
     */
    public function needsRevision(): bool
    {
        return $this->status()->where('name', 'Needs Revision')->exists();
    }

    /**
     * Check if article is submitted
     */
    public function isSubmitted(): bool
    {
        return $this->status()->where('name', 'Submitted')->exists();
    }
}
