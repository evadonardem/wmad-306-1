<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectChange extends Model
{
    protected $fillable = [
        'project_id',
        'change_type',
        'description',
        'user_id',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
