<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BarangaySportsLeagueApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_full_barangay_sports_league_api_flow(): void
    {
        $register = $this->postJson('/api/register', [
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password123',
        ])->assertCreated()
            ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token']);

        $token = $register->json('token');
        $headers = ['Authorization' => "Bearer {$token}"];

        $leagueId = $this->postJson('/api/leagues', [
            'name' => 'Barangay Cup',
            'sport' => 'Basketball',
            'description' => 'Summer league',
        ], $headers)->assertCreated()->json('id');

        $seasonId = $this->postJson("/api/leagues/{$leagueId}/seasons", [
            'name' => '2026 Season',
            'start_date' => '2026-05-01',
            'end_date' => '2026-06-30',
        ], $headers)->assertCreated()->json('id');

        $homeTeamId = $this->postJson("/api/seasons/{$seasonId}/teams", [
            'name' => 'East Hoopers',
            'coach' => 'Coach East',
        ], $headers)->assertCreated()->json('id');

        $awayTeamId = $this->postJson("/api/seasons/{$seasonId}/teams", [
            'name' => 'West Shooters',
            'coach' => 'Coach West',
        ], $headers)->assertCreated()->json('id');

        $homePlayerId = $this->postJson("/api/teams/{$homeTeamId}/players", [
            'name' => 'Juan Dela Cruz',
            'birthdate' => '2000-01-01',
            'position' => 'Guard',
            'jersey_number' => 7,
        ], $headers)->assertCreated()->json('players.0.id');

        $awayPlayerId = $this->postJson("/api/teams/{$awayTeamId}/players", [
            'name' => 'Pedro Santos',
            'birthdate' => '2001-01-01',
            'position' => 'Forward',
            'jersey_number' => 11,
        ], $headers)->assertCreated()->json('players.0.id');

        $gameId = $this->postJson("/api/seasons/{$seasonId}/games", [
            'home_team_id' => $homeTeamId,
            'away_team_id' => $awayTeamId,
            'scheduled_at' => '2026-05-10 18:00:00',
            'venue' => 'Barangay Gym',
        ], $headers)->assertCreated()->json('id');

        $this->postJson("/api/seasons/{$seasonId}/games", [
            'home_team_id' => $awayTeamId,
            'away_team_id' => $homeTeamId,
            'scheduled_at' => '2026-05-11 18:00:00',
            'venue' => 'Barangay Gym',
        ], $headers)->assertUnprocessable();

        $this->postJson("/api/games/{$gameId}/result", [
            'home_score' => 80,
            'away_score' => 70,
        ], $headers)->assertOk();

        $this->postJson("/api/games/{$gameId}/stats", [
            'stats' => [
                ['player_id' => $homePlayerId, 'points' => 25, 'assists' => 5, 'rebounds' => 8, 'fouls' => 2],
                ['player_id' => $awayPlayerId, 'points' => 18, 'assists' => 3, 'rebounds' => 6, 'fouls' => 1],
            ],
        ], $headers)->assertOk();

        $this->getJson("/api/seasons/{$seasonId}/standings", $headers)
            ->assertOk()
            ->assertJsonPath('0.team_id', $homeTeamId)
            ->assertJsonPath('0.wins', 1);

        $this->getJson("/api/seasons/{$seasonId}/leaderboard", $headers)
            ->assertOk()
            ->assertJsonPath('0.player_id', $homePlayerId)
            ->assertJsonPath('0.total_points', 25);

        $this->getJson("/api/seasons/{$seasonId}/summary", $headers)
            ->assertOk()
            ->assertJsonPath('total_games_played', 1)
            ->assertJsonPath('total_points_scored', 150);

        $this->getJson("/api/players/{$homePlayerId}/profile", $headers)
            ->assertOk()
            ->assertJsonPath('name', 'Juan Dela Cruz')
            ->assertJsonPath('career_totals.total_points', 25)
            ->assertJsonPath('personal_best_game.points', 25);
    }
}
