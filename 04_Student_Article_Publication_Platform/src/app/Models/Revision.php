<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Revision extends Model
{
    use HasFactory;

    protected $fillable = ['article_id', 'editor_id', 'comments'];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    public function editor()
    {
        return $this->belongsTo(User::class, 'editor_id');
    }
}
