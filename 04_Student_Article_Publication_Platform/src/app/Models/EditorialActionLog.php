<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EditorialActionLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id',
        'article_title',
        'acting_user_id',
        'acting_role',
        'action',
        'previous_status',
        'new_status',
        'note',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'meta' => 'array',
        ];
    }

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'acting_user_id');
    }
}
