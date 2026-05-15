<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class League extends Model
{
    protected $fillable = ['user_id', 'name', 'sport', 'description'];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function seasons(): HasMany
    {
        return $this->hasMany(Season::class);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    public function findSeason(int|string $id): ?Season
    {
        return $this->seasons()->find($id);
    }
}
