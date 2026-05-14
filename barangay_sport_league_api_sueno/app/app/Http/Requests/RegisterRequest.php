<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //'name' => 'required',
    'name' => 'required',
    'email' => 'required|email',
    'password' => 'required',
    'confirm_password' => 'required|same:password',
        ];
    }
}
