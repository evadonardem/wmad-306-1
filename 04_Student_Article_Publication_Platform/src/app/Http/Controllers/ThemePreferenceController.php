<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ThemePreferenceController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'theme' => ['required', 'string', Rule::in([
                'classic',
                'vintage',
                'modern',
                'financial',
                'broadsheet',
                'berliner',
                'guardian',
                'sunset',
            ])],
        ]);

        $request->user()->forceFill([
            'theme_preference' => $validated['theme'],
        ])->save();

        return response()->noContent();
    }
}
