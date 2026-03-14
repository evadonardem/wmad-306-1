<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubmissionDeadline extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'due_at',
        'category_id',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'due_at' => 'datetime',
            'active' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
