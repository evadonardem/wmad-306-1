<?php

namespace App\Http\Requests\Game;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubmitStatsRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'stats'                => ['required', 'array', 'min:1'],
            'stats.*.player_id'   => ['required', 'integer', Rule::exists('players', 'id')],
            'stats.*.points'      => ['required', 'integer', 'min:0'],
            'stats.*.assists'     => ['required', 'integer', 'min:0'],
            'stats.*.rebounds'    => ['required', 'integer', 'min:0'],
            'stats.*.fouls'       => ['required', 'integer', 'min:0', 'max:6'],
        ];
    }

    public function messages(): array
    {
        return [
            'stats.*.fouls.max' => 'A player cannot exceed 6 fouls in a game.',
        ];
    }
}
