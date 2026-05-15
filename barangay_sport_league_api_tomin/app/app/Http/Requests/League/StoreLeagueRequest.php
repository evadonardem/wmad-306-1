<?php

namespace App\Http\Requests\League;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeagueRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'sport'       => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
