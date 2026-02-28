<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'priority',
        'status',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
