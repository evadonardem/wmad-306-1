<?php

namespace App\Http\Controllers;

use App\Http\Requests\Team\AddPlayerRequest;
use App\Http\Requests\Team\StoreTeamRequest;
use App\Http\Requests\Team\UpdateTeamRequest;
use App\Models\Player;
use App\Models\Season;
use App\Models\Team;
use App\Traits\ApiResponder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    use ApiResponder;

    public function index(Request $request, string $seasonId): JsonResponse
    {
        $season = $this->resolveSeasonForUser($request, $seasonId);

        if (! $season) {
            return $this->notFound('Season');
        }

        return $this->ok($season->teams()->with('players')->withCount('players')->get());
    }

    public function store(StoreTeamRequest $request, string $seasonId): JsonResponse
    {
        $season = $this->resolveSeasonForUser($request, $seasonId);

        if (! $season) {
            return $this->notFound('Season');
        }

        $team = $season->teams()->create($request->validated());

        return $this->created($team, 'Team registered to season.');
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $team = $this->resolveTeamForUser($request, $id);

        if (! $team) {
            return $this->notFound('Team');
        }

        return $this->ok($team->load(['season.league', 'players']));
    }

    public function update(UpdateTeamRequest $request, string $id): JsonResponse
    {
        $team = $this->resolveTeamForUser($request, $id);

        if (! $team) {
            return $this->notFound('Team');
        }

        $team->update($request->validated());

        return $this->ok($team->fresh('players'), 'Team updated.');
    }

    public function addPlayer(AddPlayerRequest $request, string $id): JsonResponse
    {
        $team = $this->resolveTeamForUser($request, $id);

        if (! $team) {
            return $this->notFound('Team');
        }

        $data   = $request->validated();
        $player = isset($data['player_id'])
            ? Player::findOrFail($data['player_id'])
            : Player::create([
                'name'      => $data['name'],
                'birthdate' => $data['birthdate'] ?? null,
                'position'  => $data['position'] ?? null,
            ]);

        if ($team->hasPlayer($player->id)) {
            return $this->conflict("Player #{$player->id} is already on this team's roster.");
        }

        if ($team->jerseyTaken($data['jersey_number'])) {
            return $this->conflict("Jersey number {$data['jersey_number']} is already taken on this team.");
        }

        $team->players()->attach($player->id, ['jersey_number' => $data['jersey_number']]);

        return $this->created(
            $team->load('players'),
            "Player added with jersey #{$data['jersey_number']}."
        );
    }

    public function removePlayer(Request $request, string $id, string $playerId): JsonResponse
    {
        $team = $this->resolveTeamForUser($request, $id);

        if (! $team) {
            return $this->notFound('Team');
        }

        $team->players()->detach($playerId);

        return $this->deleted('Player removed from team.');
    }

    // ─── Private ──────────────────────────────────────────────────────────────

    private function resolveSeasonForUser(Request $request, string $id): ?Season
    {
        return Season::whereHas('league', fn ($q) => $q->where('user_id', $request->user()->id))
            ->find($id);
    }

    private function resolveTeamForUser(Request $request, string $id): ?Team
    {
        return Team::whereHas('season.league', fn ($q) => $q->where('user_id', $request->user()->id))
            ->find($id);
    }
}
