<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserPreferenceController extends Controller
{
    public function show(Request $request)
    {
        return response()->json([
            'theme' => $request->user()->getPreference('theme', 'classic'),
            'dark_mode' => $request->user()->getPreference('dark_mode', false),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'theme' => 'sometimes|in:classic,vintage,modern,financial,broadsheet,berliner,guardian,sunset,heritage,dawn,rustic',
            'dark_mode' => 'sometimes|boolean',
        ]);

        $user = $request->user();
        if (isset($validated['theme'])) {
            $user->setPreference('theme', $validated['theme']);
        }
        if (isset($validated['dark_mode'])) {
            $user->setPreference('dark_mode', $validated['dark_mode']);
        }
        return response()->json([
            'message' => 'Preferences updated successfully',
            'preferences' => $user->preferences,
        ]);
    }
}

