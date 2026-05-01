<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LeagueController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->leagues()->with('seasons')->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sport' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        return response()->json($request->user()->leagues()->create($data), 201);
    }

    public function show(Request $request, string $league)
    {
        $league = $this->leagueForUser($request, $league);

        return $league ? $league->load('seasons') : $this->notFound('League');
    }

    public function update(Request $request, string $league)
    {
        $league = $this->leagueForUser($request, $league);
        if (! $league) {
            return $this->notFound('League');
        }

        $league->update($request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'sport' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]));

        return $league->fresh();
    }

    public function destroy(Request $request, string $league)
    {
        $league = $this->leagueForUser($request, $league);
        if (! $league) {
            return $this->notFound('League');
        }

        $league->delete();

        return response()->noContent();
    }
}
