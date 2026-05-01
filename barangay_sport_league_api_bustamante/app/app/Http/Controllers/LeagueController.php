<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LeagueController extends Controller
{
    public function index(Request $request)
    {
        $leagues = $request->user()
            ->leagues()
            ->withCount('seasons')
            ->latest()
            ->get();

        return $this->success('Leagues retrieved successfully.', $leagues);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sport' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
        ]);

        $league = $request->user()->leagues()->create($validated);

        return $this->success('League created successfully.', $league, 201);
    }

    public function show(Request $request, string $league)
    {
        $league = $this->leagueForUser($request, $league);
        $league->load('seasons');

        return $this->success('League retrieved successfully.', $league);
    }

    public function update(Request $request, string $league)
    {
        $league = $this->leagueForUser($request, $league);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'sport' => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['sometimes', 'nullable', 'string'],
        ]);

        $league->update($validated);

        return $this->success('League updated successfully.', $league);
    }

    public function destroy(Request $request, string $league)
    {
        $league = $this->leagueForUser($request, $league);
        $league->delete();

        return $this->success('League deleted successfully.');
    }
}
