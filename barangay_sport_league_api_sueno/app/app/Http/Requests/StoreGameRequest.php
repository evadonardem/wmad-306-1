<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'team_a_id' => 'required|exists:teams,id',
            'team_b_id' => 'required|exists:teams,id|different:team_a_id',
            'game_date' => 'required|date',
        ];
    }

    public function messages()
    {
        return [
            'team_b_id.different' => 'A team cannot play against itself.',
        ];
    }
}