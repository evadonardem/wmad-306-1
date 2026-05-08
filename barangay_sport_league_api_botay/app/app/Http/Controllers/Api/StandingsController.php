<?php

namespace App\Http\Controllers\Api;

use App\Models\Season;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;

class StandingsController extends Controller
{
    /**
     * Get season standings
     */
    public function index(Request $request, Season $season): Response
    {
        $this->authorize('view', $season->league);

        $standings = $season->teams()
            ->select('teams.id', 'teams.name', 'teams.code')
            ->withPivot('wins', 'losses')
            ->get()
            ->map(function ($team) {
                $wins = $team->pivot->wins;
                $losses = $team->pivot->losses;
                $games = $wins + $losses;
                $winPercentage = $games > 0 ? round(($wins / $games) * 100, 2) : 0;

                return [
                    'team_id' => $team->id,
                    'name' => $team->name,
                    'code' => $team->code,
                    'wins' => $wins,
                    'losses' => $losses,
                    'games_played' => $games,
                    'win_percentage' => $winPercentage,
                ];
            })
            ->sortByDesc('wins')
            ->sortByDesc('win_percentage')
            ->values();

        return response([
            'season' => $season->name,
            'year' => $season->year,
            'standings' => $standings,
        ]);
    }
}
