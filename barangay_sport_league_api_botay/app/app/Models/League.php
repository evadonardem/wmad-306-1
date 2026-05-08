<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class League extends Model
{
    /** @use HasFactory */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'location',
    ];

    /**
     * Get the user who created this league
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all seasons in this league
     */
    public function seasons(): HasMany
    {
        return $this->hasMany(Season::class);
    }
}
