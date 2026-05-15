<?php

namespace App\Http\Requests\Team;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddPlayerRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'player_id'     => ['nullable', 'integer', Rule::exists('players', 'id')],
            'name'          => ['required_without:player_id', 'string', 'max:255'],
            'birthdate'     => ['nullable', 'date', 'before:today'],
            'position'      => ['nullable', 'string', 'max:100'],
            'jersey_number' => ['required', 'integer', 'min:0', 'max:99'],
        ];
    }

    public function messages(): array
    {
        return [
            'jersey_number.max' => 'Jersey numbers must be between 0 and 99.',
            'name.required_without' => 'Please provide a player name or an existing player_id.',
        ];
    }
}
