<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SeasonController extends Controller
{
    public function index(Request $request, string $league)
    {
        $league = $this->leagueForUser($request, $league);
        $seasons = $league->seasons()
            ->withCount(['teams', 'games'])
            ->latest()
            ->get();

        return $this->success('Seasons retrieved successfully.', $seasons);
    }

    public function store(Request $request, string $league)
    {
        $league = $this->leagueForUser($request, $league);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'status' => ['sometimes', Rule::in(['active', 'done'])],
        ]);

        $season = $league->seasons()->create($validated);

        return $this->success('Season created successfully.', $season, 201);
    }

    public function show(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);
        $season->load([
            'teams.players',
            'games.homeTeam',
            'games.awayTeam',
            'games.result',
        ]);

        return $this->success('Season retrieved successfully.', $season);
    }

    public function update(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'start_date' => ['sometimes', 'required', 'date'],
            'end_date' => ['sometimes', 'required', 'date', 'after_or_equal:start_date'],
            'status' => ['sometimes', Rule::in(['active', 'done'])],
        ]);

        $season->update($validated);

        return $this->success('Season updated successfully.', $season);
    }
}
