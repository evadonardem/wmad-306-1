<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleStatus extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'label'];

    public function articles()
    {
        return $this->hasMany(Article::class, 'status_id');
    }
}
