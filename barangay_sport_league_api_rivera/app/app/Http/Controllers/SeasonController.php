<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SeasonController extends Controller
{
    public function index(Request $request, string $league)
    {
        $league = $this->leagueForUser($request, $league);

        return $league ? $league->seasons()->with(['teams', 'games'])->get() : $this->notFound('League');
    }

    public function store(Request $request, string $league)
    {
        $league = $this->leagueForUser($request, $league);
        if (! $league) {
            return $this->notFound('League');
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'status' => ['sometimes', Rule::in(['active', 'done'])],
        ]);

        return response()->json($league->seasons()->create($data), 201);
    }

    public function show(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);

        return $season ? $season->load(['league', 'teams.players', 'games.result']) : $this->notFound('Season');
    }

    public function update(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);
        if (! $season) {
            return $this->notFound('Season');
        }

        $season->update($request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'start_date' => ['sometimes', 'required', 'date'],
            'end_date' => ['sometimes', 'required', 'date'],
            'status' => ['sometimes', Rule::in(['active', 'done'])],
        ]));

        return $season->fresh();
    }
}
