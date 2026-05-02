<?php
namespace App\Http\Controllers;

use App\Models\Season;
use App\Models\Team;
use App\Models\Player;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index(Request $request, ?Season $season = null)
    {
        if ($season) {
            abort_unless($season->league->user_id === $request->user()->id, 403);

            return $this->successResponse(
                $season->teams()->with(['season.league', 'players'])->get(),
                'Season teams loaded'
            );
        }

        return $this->successResponse(
            Team::query()
                ->with(['season.league', 'players'])
                ->whereHas('season.league', fn ($query) => $query->where('user_id', $request->user()->id))
                ->get(),
            'Teams loaded'
        );
    }

    public function store(Request $request, ?Season $season = null)
    {
        $data = $request->validate([
            'season_id' => $season ? 'sometimes|integer|exists:seasons,id' : 'required|integer|exists:seasons,id',
            'name' => 'required|string|max:255',
            'coach' => 'nullable|string|max:255',
        ]);

        $targetSeason = $season ?? Season::with('league')->findOrFail($data['season_id']);
        abort_unless($targetSeason->league->user_id === $request->user()->id, 403);

        $team = $targetSeason->teams()->create([
            'name' => $data['name'],
            'coach' => $data['coach'] ?? null,
        ]);

        return $this->successResponse($team->load(['season.league', 'players']), 'Team created', 201);
    }

    public function show(Request $request, Team $team)
    {
        abort_unless($team->season->league->user_id === $request->user()->id, 403);
        return $this->successResponse($team->load(['season.league', 'players']), 'Team loaded');
    }

    public function update(Request $request, Team $team)
    {
        abort_unless($team->season->league->user_id === $request->user()->id, 403);
        $team->update($request->validate([
            'name' => 'sometimes|required|string|max:255',
            'coach' => 'sometimes|nullable|string|max:255',
        ]));
        return $this->successResponse($team->load(['season.league', 'players']), 'Team updated');
    }

    public function destroy(Request $request, Team $team)
    {
        abort_unless($team->season->league->user_id === $request->user()->id, 403);
        $team->delete();

        return $this->successResponse(null, 'Team deleted');
    }

    public function addPlayer(Request $request, Team $team)
    {
        abort_unless($team->season->league->user_id === $request->user()->id, 403);
        $data = $request->validate([
            'player_id' => 'required|integer|exists:players,id',
            'jersey_number' => 'required|integer|min:0',
        ]);
        $player = Player::findOrFail($data['player_id']);
        $team->players()->syncWithoutDetaching([
            $player->id => ['jersey_number' => $data['jersey_number']],
        ]);

        return $this->successResponse($team->load('players'), 'Player added', 201);
    }

    public function removePlayer(Request $request, Team $team, Player $player)
    {
        abort_unless($team->season->league->user_id === $request->user()->id, 403);
        $team->players()->detach($player->id);

        return $this->successResponse($team->load('players'), 'Player removed');
    }
}
