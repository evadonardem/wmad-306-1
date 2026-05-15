<?php

namespace App\Http\Controllers;

use App\Http\Requests\Season\StoreSeasonRequest;
use App\Http\Requests\Season\UpdateSeasonRequest;
use App\Models\Season;
use App\Traits\ApiResponder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeasonController extends Controller
{
    use ApiResponder;

    public function index(Request $request, string $leagueId): JsonResponse
    {
        $league = $request->user()->findLeague($leagueId);

        if (! $league) {
            return $this->notFound('League');
        }

        $seasons = $league->seasons()
            ->withCount(['teams', 'games'])
            ->latest()
            ->get();

        return $this->ok($seasons);
    }

    public function store(StoreSeasonRequest $request, string $leagueId): JsonResponse
    {
        $league = $request->user()->findLeague($leagueId);

        if (! $league) {
            return $this->notFound('League');
        }

        $season = $league->seasons()->create(
            array_merge($request->validated(), ['status' => $request->validated()['status'] ?? 'active'])
        );

        return $this->created($season, 'Season created.');
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $season = $this->resolveSeasonForUser($request, $id);

        if (! $season) {
            return $this->notFound('Season');
        }

        return $this->ok(
            $season->load(['league', 'teams.players', 'games.homeTeam', 'games.awayTeam', 'games.result'])
        );
    }

    public function update(UpdateSeasonRequest $request, string $id): JsonResponse
    {
        $season = $this->resolveSeasonForUser($request, $id);

        if (! $season) {
            return $this->notFound('Season');
        }

        $season->update($request->validated());

        return $this->ok($season->fresh(), 'Season updated.');
    }

    // ─── Private ──────────────────────────────────────────────────────────────

    private function resolveSeasonForUser(Request $request, string $id): ?Season
    {
        return Season::whereHas('league', fn ($q) => $q->where('user_id', $request->user()->id))
            ->find($id);
    }
}
