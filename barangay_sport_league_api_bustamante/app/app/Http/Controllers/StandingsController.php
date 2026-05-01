<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StandingsController extends Controller
{
    public function standings(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);
        $teams = $season->teams()->orderBy('name')->get();
        $records = $teams->mapWithKeys(fn ($team) => [
            $team->id => [
                'team_id' => $team->id,
                'team_name' => $team->name,
                'wins' => 0,
                'losses' => 0,
                'games_played' => 0,
            ],
        ])->all();

        $games = $season->games()
            ->where('status', 'done')
            ->with('result')
            ->get();

        foreach ($games as $game) {
            if (! $game->result) {
                continue;
            }

            $homeId = $game->home_team_id;
            $awayId = $game->away_team_id;

            $records[$homeId]['games_played']++;
            $records[$awayId]['games_played']++;

            if ($game->result->home_score > $game->result->away_score) {
                $records[$homeId]['wins']++;
                $records[$awayId]['losses']++;
            } elseif ($game->result->away_score > $game->result->home_score) {
                $records[$awayId]['wins']++;
                $records[$homeId]['losses']++;
            }
        }

        $standings = collect($records)
            ->sortBy([
                ['wins', 'desc'],
                ['losses', 'asc'],
                ['team_name', 'asc'],
            ])
            ->values();

        return $this->success('Standings retrieved successfully.', $standings);
    }

    public function leaderboard(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);

        $leaders = DB::table('player_stats')
            ->join('players', 'players.id', '=', 'player_stats.player_id')
            ->join('game_results', 'game_results.id', '=', 'player_stats.game_result_id')
            ->join('games', 'games.id', '=', 'game_results.game_id')
            ->where('games.season_id', $season->id)
            ->where('games.status', 'done')
            ->select([
                'players.id',
                'players.name',
                'players.position',
                DB::raw('SUM(player_stats.points) as total_points'),
            ])
            ->groupBy('players.id', 'players.name', 'players.position')
            ->orderByDesc('total_points')
            ->limit(10)
            ->get();

        return $this->success('Leaderboard retrieved successfully.', $leaders);
    }

    public function summary(Request $request, string $season)
    {
        $season = $this->seasonForUser($request, $season);
        $teams = $season->teams()->get()->keyBy('id');
        $completedGames = $season->games()
            ->where('status', 'done')
            ->with('result')
            ->get()
            ->filter(fn ($game) => $game->result !== null);

        if ($completedGames->isEmpty()) {
            $this->notFound('Season has no completed games yet.');
        }

        $teamPoints = $teams->mapWithKeys(fn ($team) => [$team->id => 0])->all();
        $totalPoints = 0;

        foreach ($completedGames as $game) {
            $homeScore = $game->result->home_score;
            $awayScore = $game->result->away_score;

            $teamPoints[$game->home_team_id] += $homeScore;
            $teamPoints[$game->away_team_id] += $awayScore;
            $totalPoints += $homeScore + $awayScore;
        }

        $topTeamId = collect($teamPoints)->sortDesc()->keys()->first();
        $topTeam = $teams->get($topTeamId);

        $data = [
            'total_games_played' => $completedGames->count(),
            'total_games_scheduled' => $season->games()->where('status', 'scheduled')->count(),
            'games_remaining' => $season->games()->where('status', 'scheduled')->count(),
            'top_scoring_team' => $topTeam ? [
                'team_id' => $topTeam->id,
                'team_name' => $topTeam->name,
                'total_points' => $teamPoints[$topTeamId],
            ] : null,
            'total_points_scored' => $totalPoints,
        ];

        return $this->success('Season summary retrieved successfully.', $data);
    }
}
