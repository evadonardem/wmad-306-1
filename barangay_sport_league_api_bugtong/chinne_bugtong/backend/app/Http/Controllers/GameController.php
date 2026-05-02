<?php
namespace App\Http\Controllers;

use App\Models\Season;
use App\Models\Game;
use App\Models\GameResult;
use App\Models\PlayerStat;
use App\Models\Team;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index(Request $request, ?Season $season = null)
    {
        if ($season) {
            abort_unless($season->league->user_id === $request->user()->id, 403);

            return $this->successResponse(
                $season->games()->with(['homeTeam','awayTeam','result','stats.player'])->get(),
                'Season games loaded'
            );
        }

        return $this->successResponse(
            Game::query()
                ->with(['season.league', 'homeTeam', 'awayTeam', 'result', 'stats.player'])
                ->whereHas('season.league', fn ($query) => $query->where('user_id', $request->user()->id))
                ->get(),
            'Games loaded'
        );
    }

    public function store(Request $request, ?Season $season = null)
    {
        $data = $request->validate([
            'season_id' => $season ? 'sometimes|integer|exists:seasons,id' : 'required|integer|exists:seasons,id',
            'home_team_id' => 'required|integer|exists:teams,id|different:away_team_id',
            'away_team_id' => 'required|integer|exists:teams,id',
            'scheduled_at' => 'required|date',
            'venue' => 'nullable|string|max:255',
        ]);

        $season = $season ?? Season::with('league')->findOrFail($data['season_id']);
        abort_unless($season->league->user_id === $request->user()->id, 403);

        if (! $season->teams()->whereKey($data['home_team_id'])->exists() || ! $season->teams()->whereKey($data['away_team_id'])->exists()) {
            return $this->errorResponse('Both teams must be registered in the season', 422);
        }

        $game = $season->games()->create([
            'home_team_id' => $data['home_team_id'],
            'away_team_id' => $data['away_team_id'],
            'scheduled_at' => $data['scheduled_at'],
            'venue' => $data['venue'] ?? null,
            'status' => 'scheduled',
        ]);

        return $this->successResponse($game->load(['season.league', 'homeTeam', 'awayTeam', 'result', 'stats.player']), 'Game created', 201);
    }

    public function show(Request $request, Game $game)
    {
        abort_unless($game->season->league->user_id === $request->user()->id, 403);
        return $this->successResponse($game->load(['season.league', 'result', 'stats.player', 'homeTeam', 'awayTeam']), 'Game loaded');
    }

    public function update(Request $request, Game $game)
    {
        abort_unless($game->season->league->user_id === $request->user()->id, 403);

        $data = $request->validate([
            'home_team_id' => 'sometimes|required|integer|exists:teams,id|different:away_team_id',
            'away_team_id' => 'sometimes|required|integer|exists:teams,id',
            'scheduled_at' => 'sometimes|required|date',
            'venue' => 'sometimes|nullable|string|max:255',
            'status' => 'sometimes|in:scheduled,done',
        ]);

        $game->update($data);

        return $this->successResponse($game->load(['season.league', 'homeTeam', 'awayTeam', 'result', 'stats.player']), 'Game updated');
    }

    public function destroy(Request $request, Game $game)
    {
        abort_unless($game->season->league->user_id === $request->user()->id, 403);
        $game->delete();

        return $this->successResponse(null, 'Game deleted');
    }

    public function submitResult(Request $request, Game $game)
    {
        abort_unless($game->season->league->user_id === $request->user()->id, 403);
        $data = $request->validate([
            'home_score' => 'required|integer|min:0',
            'away_score' => 'required|integer|min:0',
        ]);
        $result = $game->result()->updateOrCreate(
            ['game_id' => $game->id],
            ['home_score' => $data['home_score'], 'away_score' => $data['away_score']]
        );
        $game->status = 'done';
        $game->save();

        return $this->successResponse($result->load('game'), 'Game result saved', 201);
    }

    public function submitStats(Request $request, Game $game)
    {
        abort_unless($game->season->league->user_id === $request->user()->id, 403);
        $result = $game->result;
        if (! $result) {
            return $this->errorResponse('Submit the game result before player stats.', 422);
        }

        $items = $request->validate([
            'stats' => 'required|array|min:1',
            'stats.*.player_id' => 'required|integer|exists:players,id',
            'stats.*.points' => 'nullable|integer|min:0',
            'stats.*.assists' => 'nullable|integer|min:0',
            'stats.*.rebounds' => 'nullable|integer|min:0',
            'stats.*.fouls' => 'nullable|integer|min:0',
        ]);
        $created = [];
        foreach ($items['stats'] as $s) {
            $playerOnSeason = $game->season->teams()->whereHas('players', fn ($query) => $query->whereKey($s['player_id']))->exists();
            if (! $playerOnSeason) {
                return $this->errorResponse('Each player must belong to one of the season teams.', 422);
            }

            $created[] = PlayerStat::updateOrCreate([
                'game_result_id' => $result->id,
                'player_id' => $s['player_id'],
            ], [
                'points' => $s['points'] ?? 0,
                'assists' => $s['assists'] ?? 0,
                'rebounds' => $s['rebounds'] ?? 0,
                'fouls' => $s['fouls'] ?? 0,
            ]);
        }

        return $this->successResponse(
            $result->stats()->with('player')->get(),
            'Player stats saved',
            201
        );
    }
}
