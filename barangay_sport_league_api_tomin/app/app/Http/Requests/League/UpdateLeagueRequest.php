<?php

namespace App\Http\Requests\League;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLeagueRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'        => ['sometimes', 'required', 'string', 'max:255'],
            'sport'       => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
