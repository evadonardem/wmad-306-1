<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    public function index()
    {
        $players = Player::query()->latest()->get();

        return $this->success('Players retrieved successfully.', $players);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'birthdate' => ['nullable', 'date'],
            'position' => ['nullable', 'string', 'max:100'],
        ]);

        $player = Player::create($validated);

        return $this->success('Player created successfully.', $player, 201);
    }

    public function show(string $player)
    {
        $player = Player::with('teams.season')->find($player);

        if (! $player) {
            $this->notFound('Player not found.');
        }

        return $this->success('Player retrieved successfully.', $player);
    }

    public function update(Request $request, string $player)
    {
        $player = Player::find($player);

        if (! $player) {
            $this->notFound('Player not found.');
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'birthdate' => ['sometimes', 'nullable', 'date'],
            'position' => ['sometimes', 'nullable', 'string', 'max:100'],
        ]);

        $player->update($validated);

        return $this->success('Player updated successfully.', $player);
    }

    public function destroy(string $player)
    {
        $player = Player::find($player);

        if (! $player) {
            $this->notFound('Player not found.');
        }

        $player->delete();

        return $this->success('Player deleted successfully.');
    }

    public function profile(string $player)
    {
        $player = Player::with([
            'teams.season',
            'stats.result.game.homeTeam',
            'stats.result.game.awayTeam',
        ])->find($player);

        if (! $player) {
            $this->notFound('Player not found.');
        }

        $stats = $player->stats;
        $bestStat = $stats->sortByDesc('points')->first();

        $data = [
            'id' => $player->id,
            'name' => $player->name,
            'position' => $player->position,
            'teams' => $player->teams->map(fn ($team) => [
                'id' => $team->id,
                'name' => $team->name,
                'coach' => $team->coach,
                'season' => [
                    'id' => $team->season?->id,
                    'name' => $team->season?->name,
                ],
                'jersey_number' => $team->pivot->jersey_number,
            ])->values(),
            'career_totals' => [
                'total_games_played' => $stats->pluck('game_result_id')->unique()->count(),
                'total_points' => $stats->sum('points'),
                'total_assists' => $stats->sum('assists'),
                'total_rebounds' => $stats->sum('rebounds'),
            ],
            'personal_best_game' => $bestStat ? [
                'points' => $bestStat->points,
                'game' => [
                    'id' => $bestStat->result->game->id,
                    'scheduled_at' => $bestStat->result->game->scheduled_at,
                    'venue' => $bestStat->result->game->venue,
                    'home_team' => $bestStat->result->game->homeTeam,
                    'away_team' => $bestStat->result->game->awayTeam,
                ],
            ] : null,
        ];

        return $this->success('Player profile retrieved successfully.', $data);
    }
}
