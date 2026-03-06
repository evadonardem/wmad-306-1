<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'article_status_id',
        'title',
        'slug',
        'content',
        'submitted_at',
        'published_at',
        // Public homepage visibility metadata.
        'is_public',
        'public_approved_by',
        'public_approved_at',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
            'published_at' => 'datetime',
            // Keep public visibility logic type-safe.
            'is_public' => 'boolean',
            'public_approved_at' => 'datetime',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(ArticleStatus::class, 'article_status_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(Revision::class);
    }

    public function draftVersions(): HasMany
    {
        return $this->hasMany(DraftVersion::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function publicApprover(): BelongsTo
    {
        // Editor user that approved this article for public browsing.
        return $this->belongsTo(User::class, 'public_approved_by');
    }

    public function stars(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'article_stars')->withTimestamps();
    }

    public function views(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'article_views')->withTimestamps();
    }

    public function saves(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'article_saves')->withTimestamps();
    }
}
