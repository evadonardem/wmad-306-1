<?php
namespace App\Http\Controllers;

use App\Models\League;
use App\Models\Season;
use Illuminate\Http\Request;

class SeasonController extends Controller
{
    public function index(Request $request, League $league)
    {
        abort_unless($league->user_id === $request->user()->id, 403);
        return $this->successResponse(
            $league->seasons()->with('teams.players')->get(),
            'Seasons loaded'
        );
    }

    public function store(Request $request, League $league)
    {
        abort_unless($league->user_id === $request->user()->id, 403);
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'nullable|in:active,done',
        ]);
        $season = $league->seasons()->create($data);
        return $this->successResponse($season->load('teams.players'), 'Season created', 201);
    }

    public function show(Request $request, Season $season)
    {
        abort_unless($season->league->user_id === $request->user()->id, 403);
        return $this->successResponse(
            $season->load(['teams.players', 'games.homeTeam', 'games.awayTeam', 'games.result', 'games.stats.player']),
            'Season loaded'
        );
    }

    public function update(Request $request, Season $season)
    {
        abort_unless($season->league->user_id === $request->user()->id, 403);
        $season->update($request->validate([
            'name' => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date',
            'status' => 'sometimes|nullable|in:active,done',
        ]));
        return $this->successResponse($season->load('teams.players'), 'Season updated');
    }
}
