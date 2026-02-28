<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Http\Requests\ProfileUpdateRequest;
use Carbon\Carbon;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $userId = $request->user()->id;

        $projectsCount = Project::query()
            ->where('user_id', $userId)
            ->count();

        $tasksQuery = Task::query()->whereHas('project', function ($q) use ($userId): void {
            $q->where('user_id', $userId);
        });

        $tasksCount = (clone $tasksQuery)->count();
        $completedCount = (clone $tasksQuery)->where('status', 'completed')->count();

        $days = (clone $tasksQuery)
            ->where('status', 'completed')
            ->select(DB::raw('DATE(updated_at) as day'))
            ->groupBy('day')
            ->orderByDesc('day')
            ->pluck('day')
            ->map(fn ($d) => (string) $d)
            ->all();

        $set = array_fill_keys($days, true);

        $cursor = Carbon::today();
        if (!isset($set[$cursor->toDateString()])) {
            $cursor = $cursor->copy()->subDay();
        }

        $streakDays = 0;
        while (isset($set[$cursor->toDateString()])) {
            $streakDays++;
            $cursor->subDay();
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'stats' => [
                'projects' => $projectsCount,
                'tasks' => $tasksCount,
                'completed' => $completedCount,
                'streakDays' => $streakDays,
            ],
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
