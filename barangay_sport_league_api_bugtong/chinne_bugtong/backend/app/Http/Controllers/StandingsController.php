<?php
namespace App\Http\Controllers;

use App\Models\Season;
use App\Models\PlayerStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StandingsController extends Controller
{
    public function standings(Request $request, Season $season)
    {
        abort_unless($season->league->user_id === $request->user()->id, 403);
        // Compute W-L per team for completed games
        $results = $season->games()->where('status','done')->with('result','homeTeam','awayTeam')->get();
        $stats = [];
        foreach ($season->teams()->with('players')->get() as $team) {
            $stats[$team->id] = ['team' => $team, 'wins' => 0, 'losses' => 0];
        }
        foreach ($results as $game) {
            $r = $game->result;
            if (! $r) continue;
            if ($r->home_score > $r->away_score) {
                $stats[$game->home_team_id]['wins']++;
                $stats[$game->away_team_id]['losses']++;
            } elseif ($r->away_score > $r->home_score) {
                $stats[$game->away_team_id]['wins']++;
                $stats[$game->home_team_id]['losses']++;
            }
        }
        usort($stats, function($a,$b){return $b['wins'] <=> $a['wins'];});
        return $this->successResponse(array_values($stats), 'Standings loaded');
    }

    public function leaderboard(Request $request, Season $season)
    {
        abort_unless($season->league->user_id === $request->user()->id, 403);

        return $this->successResponse(
            PlayerStat::query()
            ->select('player_stats.player_id', DB::raw('SUM(points) as total_points'))
            ->join('game_results', 'game_results.id', '=', 'player_stats.game_result_id')
            ->join('games', 'games.id', '=', 'game_results.game_id')
            ->where('games.season_id', $season->id)
            ->where('games.status', 'done')
            ->groupBy('player_stats.player_id')
            ->with('player')
            ->orderByDesc('total_points')
            ->limit(10)
            ->get(),
            'Leaderboard loaded'
        );
    }
}
