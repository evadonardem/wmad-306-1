<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['article_id', 'student_id', 'content'];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
