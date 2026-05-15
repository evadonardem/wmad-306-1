<?php

namespace App\Http\Controllers;

use App\Http\Requests\League\StoreLeagueRequest;
use App\Http\Requests\League\UpdateLeagueRequest;
use App\Models\League;
use App\Traits\ApiResponder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeagueController extends Controller
{
    use ApiResponder;

    public function index(Request $request): JsonResponse
    {
        $leagues = $request->user()
            ->leagues()
            ->withCount('seasons')
            ->latest()
            ->get();

        return $this->ok($leagues);
    }

    public function store(StoreLeagueRequest $request): JsonResponse
    {
        $league = $request->user()->leagues()->create($request->validated());

        return $this->created($league, 'League created successfully.');
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $league = $request->user()->findLeague($id);

        if (! $league) {
            return $this->notFound('League');
        }

        return $this->ok($league->load('seasons'));
    }

    public function update(UpdateLeagueRequest $request, string $id): JsonResponse
    {
        $league = $request->user()->findLeague($id);

        if (! $league) {
            return $this->notFound('League');
        }

        $league->update($request->validated());

        return $this->ok($league->fresh(), 'League updated.');
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $league = $request->user()->findLeague($id);

        if (! $league) {
            return $this->notFound('League');
        }

        $league->delete();

        return $this->deleted('League deleted.');
    }
}
