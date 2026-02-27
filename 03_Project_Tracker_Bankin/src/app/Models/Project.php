<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'status', 'difficulty', 'progress', 'is_favorite', 'start_date', 'end_date'];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function recalculateProgress()
    {
        $tasks = $this->tasks();
        $total = $tasks->count();
        $finished = $tasks->where('status', 'finished')->count();
        $this->progress = $total > 0 ? (int) round(($finished / $total) * 100) : 0;

        if ($this->progress === 100) {
            $this->status = 'completed';
        } elseif ($this->progress > 0) {
            $this->status = 'in_progress';
        } else {
            $this->status = 'pending';
        }

        $this->save();

        return $this;
    }
}
