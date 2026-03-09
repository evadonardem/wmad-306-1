<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    // FIXED: Changed 'user_id' to 'student_id' to match your database table
    protected $fillable = ['student_id', 'article_id', 'parent_id', 'content'];

    // This allows our React frontend to still use "comment.user.name" while querying "student_id"
    public function user()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id')->with('user', 'replies');
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }
}
