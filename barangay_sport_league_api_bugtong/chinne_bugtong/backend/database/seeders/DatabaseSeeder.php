<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\GameResult;
use App\Models\League;
use App\Models\Player;
use App\Models\PlayerStat;
use App\Models\Season;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $users = collect([
            User::updateOrCreate(
                ['email' => 'admin@example.com'],
                [
                    'name' => 'Admin User',
                    'password' => Hash::make('password'),
                ]
            ),
            User::updateOrCreate(
                ['email' => 'coach1@example.com'],
                [
                    'name' => 'Coach Maria',
                    'password' => Hash::make('password'),
                ]
            ),
            User::updateOrCreate(
                ['email' => 'coach2@example.com'],
                [
                    'name' => 'Coach Juan',
                    'password' => Hash::make('password'),
                ]
            ),
        ]);

        $teamNames = ['North', 'South', 'East', 'West'];
        $gamePairings = [
            [0, 1],
            [2, 3],
            [0, 2],
        ];

        foreach ($users as $userIndex => $user) {
            $league = League::updateOrCreate(
                ['user_id' => $user->id, 'name' => 'Barangay League '.($userIndex + 1)],
                League::factory()->raw([
                    'user_id' => $user->id,
                    'name' => 'Barangay League '.($userIndex + 1),
                ])
            );

            $season = Season::updateOrCreate(
                ['league_id' => $league->id, 'name' => 'Season '.($userIndex + 1)],
                Season::factory()->raw([
                    'league_id' => $league->id,
                    'name' => 'Season '.($userIndex + 1),
                    'status' => 'active',
                ])
            );

            $teams = collect();
            foreach ($teamNames as $teamIndex => $teamName) {
                $teams->push(
                    Team::updateOrCreate(
                        ['season_id' => $season->id, 'name' => $league->name.' '.$teamName.' Team'],
                        Team::factory()->raw([
                            'season_id' => $season->id,
                            'name' => $league->name.' '.$teamName.' Team',
                            'coach' => 'Coach '.chr(65 + $teamIndex),
                        ])
                    )
                );
            }

            foreach ($teams as $teamIndex => $team) {
                for ($slot = 1; $slot <= 3; $slot++) {
                    $player = Player::updateOrCreate(
                        ['name' => $season->name.' '.$team->name.' Player '.$slot],
                        Player::factory()->raw([
                            'name' => $season->name.' '.$team->name.' Player '.$slot,
                        ])
                    );

                    $team->players()->syncWithoutDetaching([
                        $player->id => ['jersey_number' => ($teamIndex * 10) + $slot],
                    ]);
                }
            }

            foreach ($gamePairings as $gameIndex => [$homeIndex, $awayIndex]) {
                $homeTeam = $teams[$homeIndex];
                $awayTeam = $teams[$awayIndex];

                $game = Game::updateOrCreate(
                    [
                        'season_id' => $season->id,
                        'home_team_id' => $homeTeam->id,
                        'away_team_id' => $awayTeam->id,
                    ],
                    Game::factory()->raw([
                        'season_id' => $season->id,
                        'home_team_id' => $homeTeam->id,
                        'away_team_id' => $awayTeam->id,
                        'scheduled_at' => now()->addDays($gameIndex + 1),
                        'venue' => $season->name.' Court '.($gameIndex + 1),
                        'status' => 'done',
                    ])
                );

                $result = GameResult::updateOrCreate(
                    ['game_id' => $game->id],
                    GameResult::factory()->raw([
                        'game_id' => $game->id,
                        'home_score' => 70 + ($gameIndex * 4) + $userIndex,
                        'away_score' => 65 + ($gameIndex * 3) + $userIndex,
                    ])
                );

                $scoringPlayers = collect([
                    $homeTeam->players()->first(),
                    $homeTeam->players()->skip(1)->first(),
                    $awayTeam->players()->first(),
                    $awayTeam->players()->skip(1)->first(),
                ])->filter();

                foreach ($scoringPlayers as $statIndex => $player) {
                    PlayerStat::updateOrCreate(
                        [
                            'game_result_id' => $result->id,
                            'player_id' => $player->id,
                        ],
                        PlayerStat::factory()->raw([
                            'game_result_id' => $result->id,
                            'player_id' => $player->id,
                            'points' => 10 + $statIndex + $gameIndex,
                            'assists' => 2 + $statIndex,
                            'rebounds' => 3 + $statIndex,
                            'fouls' => $statIndex % 3,
                        ])
                    );
                }
            }
        }
    }
}
