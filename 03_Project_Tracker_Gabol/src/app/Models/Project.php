<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'status',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Get the user that owns the project.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the tasks for the project.
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Get the count of completed tasks.
     */
    public function getCompletedTasksCount()
    {
        return $this->tasks()->where('status', 'completed')->count();
    }

    /**
     * Get the total count of tasks.
     */
    public function getTotalTasksCount()
    {
        return $this->tasks()->count();
    }

    /**
     * Get the progress percentage.
     */
    public function getProgressPercentage()
    {
        $total = $this->getTotalTasksCount();
        if ($total === 0) {
            return 0;
        }
        return round(($this->getCompletedTasksCount() / $total) * 100);
    }
}
