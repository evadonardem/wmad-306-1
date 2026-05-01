# Barangay Sports League API Documentation

## Overview

The Barangay Sports League API is a REST API for managing a community sports league. It supports user authentication, league management, seasons, teams, players, game schedules, game results, player statistics, standings, leaderboards, season summaries, and player career profiles.

The API uses Laravel Sanctum token authentication. Users must register or log in to receive a Bearer token. All main API resources are protected and can only be accessed by the authenticated user who owns the league data.

## Base URL

When running with Laravel's local server:

```text
http://127.0.0.1:8000/api
```

When running with Docker/nginx:

```text
http://127.0.0.1:8080/api
```

## Authentication

The API uses Bearer token authentication through Laravel Sanctum.

After registering or logging in, copy the returned `token` value and send it with protected requests:

```http
Authorization: Bearer YOUR_TOKEN_HERE
Accept: application/json
Content-Type: application/json
```

## Standard Request Headers

All requests to the API should include these headers:

| Header | Value | Required | Notes |
| --- | --- | --- | --- |
| `Content-Type` | `application/json` | Yes for POST/PUT/PATCH | Tells server to expect JSON |
| `Accept` | `application/json` | Yes | Tells server to return JSON |
| `Authorization` | `Bearer YOUR_TOKEN_HERE` | Yes (except register/login) | Sanctum authentication token |

Example complete request:

```http
GET /api/leagues HTTP/1.1
Host: 127.0.0.1:8000
Authorization: Bearer YOUR_TOKEN_HERE
Accept: application/json
Content-Type: application/json
```

## Standard HTTP Status Codes

| Status Code | Meaning |
| --- | --- |
| `200 OK` | Request succeeded |
| `201 Created` | Resource was created |
| `204 No Content` | Resource was deleted or removed |
| `401 Unauthorized` | Missing or invalid authentication token |
| `404 Not Found` | Resource does not exist or does not belong to the authenticated user |
| `422 Unprocessable Entity` | Validation or business rule error |

## Pagination & Response Limits

**List endpoints** (GET requests that return collections) return **all results** without pagination:

- `GET /leagues` — Returns all leagues for the user
- `GET /leagues/{league}/seasons` — Returns all seasons
- `GET /seasons/{season}/teams` — Returns all teams
- `GET /seasons/{season}/games` — Returns all games

**Limited endpoints** (capped by design):

| Endpoint | Limit | Reason |
| --- | --- | --- |
| `GET /seasons/{season}/leaderboard` | Top 10 players | Leaderboard use case |
| `GET /seasons/{season}/standings` | All teams | Complete standings needed |

## Rate Limiting

This API is designed for **local development and small-scale deployments**. Rate limiting is **not currently enforced**.

For production deployments, consider adding:
- Per-user request limits (e.g., 100 requests/minute)
- IP-based throttling using Laravel middleware
- Queue-based operations for heavy computations

## API Versioning

The API does not use versioning in the URL (no `/v1/` prefix). All endpoints use the base path:

```
/api
```

If breaking changes are needed in the future, versioning will be introduced as `/api/v2`, `/api/v3`, etc., and the current version will remain available for backward compatibility.

## Data Model Summary

### User

Represents an API account/admin.

Important fields:

| Field | Type | Description |
| --- | --- | --- |
| `id` | integer | User ID |
| `name` | string | User name |
| `email` | string | User email |
| `password` | string | Hashed password |

Relationships:

| Relationship | Description |
| --- | --- |
| `leagues` | A user owns many leagues |

### League

Represents a sports league owned by a user.

Important fields:

| Field | Type | Description |
| --- | --- | --- |
| `id` | integer | League ID |
| `user_id` | integer | Owner user ID |
| `name` | string | League name |
| `sport` | string | Sport type, for example `Basketball` |
| `description` | string/null | Optional league description |

Relationships:

| Relationship | Description |
| --- | --- |
| `user` | League belongs to one user |
| `seasons` | League has many seasons |

### Season

Represents a season under a league.

Important fields:

| Field | Type | Description |
| --- | --- | --- |
| `id` | integer | Season ID |
| `league_id` | integer | Parent league ID |
| `name` | string | Season name |
| `start_date` | date | Season start date |
| `end_date` | date | Season end date |
| `status` | string | `active` or `done` |

Relationships:

| Relationship | Description |
| --- | --- |
| `league` | Season belongs to one league |
| `teams` | Season has many teams |
| `games` | Season has many games |

### Team

Represents a team registered in a season.

Important fields:

| Field | Type | Description |
| --- | --- | --- |
| `id` | integer | Team ID |
| `season_id` | integer | Parent season ID |
| `name` | string | Team name |
| `coach` | string/null | Coach name |

Relationships:

| Relationship | Description |
| --- | --- |
| `season` | Team belongs to one season |
| `players` | Team has many players through `player_team` pivot |
| `homeGames` | Games where this team is the home team |
| `awayGames` | Games where this team is the away team |

### Player

Represents a player record. A player can join different teams across different seasons.

Important fields:

| Field | Type | Description |
| --- | --- | --- |
| `id` | integer | Player ID |
| `name` | string | Player name |
| `birthdate` | date/null | Player birthdate |
| `position` | string/null | Player position |

Relationships:

| Relationship | Description |
| --- | --- |
| `teams` | Player belongs to many teams through `player_team` |
| `stats` | Player has many player stat records |

### Player Team Pivot

The `player_team` table stores the many-to-many relationship between teams and players.

Important fields:

| Field | Type | Description |
| --- | --- | --- |
| `team_id` | integer | Team ID |
| `player_id` | integer | Player ID |
| `jersey_number` | integer | Player jersey number for that team |

### Game

Represents a scheduled or completed game.

Important fields:

| Field | Type | Description |
| --- | --- | --- |
| `id` | integer | Game ID |
| `season_id` | integer | Parent season ID |
| `home_team_id` | integer | Home team ID |
| `away_team_id` | integer | Away team ID |
| `scheduled_at` | datetime | Game schedule |
| `venue` | string/null | Game venue |
| `status` | string | `scheduled` or `done` |

Relationships:

| Relationship | Description |
| --- | --- |
| `season` | Game belongs to one season |
| `homeTeam` | Game belongs to one home team |
| `awayTeam` | Game belongs to one away team |
| `result` | Game has one result |

### Game Result

Represents the final score of a completed game.

Important fields:

| Field | Type | Description |
| --- | --- | --- |
| `id` | integer | Result ID |
| `game_id` | integer | Game ID |
| `home_score` | integer | Final score of home team |
| `away_score` | integer | Final score of away team |

Relationships:

| Relationship | Description |
| --- | --- |
| `game` | Result belongs to one game |
| `playerStats` | Result has many player stats |

### Player Stat

Represents a player's individual stats for a completed game.

Important fields:

| Field | Type | Description |
| --- | --- | --- |
| `id` | integer | Player stat ID |
| `game_result_id` | integer | Game result ID |
| `player_id` | integer | Player ID |
| `points` | integer | Player points |
| `assists` | integer | Player assists |
| `rebounds` | integer | Player rebounds |
| `fouls` | integer | Player fouls |

## API Endpoints

## Authentication Endpoints

### Register

Creates a new user and returns a Sanctum token.

```http
POST /register
```

Authentication required: No

Request body:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

Successful response:

```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  },
  "token": "plain-text-token"
}
```

Possible responses:

| Status | Description |
| --- | --- |
| `201` | User created |
| `422` | Validation failed |

### Login

Authenticates a user and returns a Sanctum token.

```http
POST /login
```

Authentication required: No

Request body:

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Successful response:

```json
{
  "token": "plain-text-token",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

Possible responses:

| Status | Description |
| --- | --- |
| `200` | Login successful |
| `401` | Invalid credentials |
| `422` | Validation failed |

### Logout

Deletes the current Sanctum token.

```http
POST /logout
```

Authentication required: Yes

Successful response:

```json
{
  "message": "Logged out successfully."
}
```

Possible responses:

| Status | Description |
| --- | --- |
| `200` | Logout successful |
| `401` | Missing or invalid token |

## League Endpoints

### List Leagues

Returns all leagues owned by the authenticated user.

```http
GET /leagues
```

Authentication required: Yes

Successful response:

```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "Barangay Cup",
    "sport": "Basketball",
    "description": "Summer league",
    "seasons": []
  }
]
```

### Create League

Creates a league for the authenticated user.

```http
POST /leagues
```

Authentication required: Yes

Request body:

```json
{
  "name": "Barangay Cup",
  "sport": "Basketball",
  "description": "Summer league"
}
```

Possible responses:

| Status | Description |
| --- | --- |
| `201` | League created |
| `401` | Missing or invalid token |
| `422` | Validation failed |

### Show League

Returns one league with its seasons.

```http
GET /leagues/{league}
```

Authentication required: Yes

Possible responses:

| Status | Description |
| --- | --- |
| `200` | League found |
| `401` | Missing or invalid token |
| `404` | League not found or not owned by user |

### Update League

Updates a league.

```http
PUT /leagues/{league}
PATCH /leagues/{league}
```

Authentication required: Yes

Request body:

```json
{
  "name": "Updated Barangay Cup",
  "sport": "Basketball",
  "description": "Updated description"
}
```

Possible responses:

| Status | Description |
| --- | --- |
| `200` | League updated |
| `401` | Missing or invalid token |
| `404` | League not found or not owned by user |
| `422` | Validation failed |

### Delete League

Deletes a league.

```http
DELETE /leagues/{league}
```

Authentication required: Yes

Possible responses:

| Status | Description |
| --- | --- |
| `204` | League deleted |
| `401` | Missing or invalid token |
| `404` | League not found or not owned by user |

## Season Endpoints

### List Seasons In A League

Returns seasons under a league owned by the authenticated user.

```http
GET /leagues/{league}/seasons
```

Authentication required: Yes

### Create Season

Creates a season under a league.

```http
POST /leagues/{league}/seasons
```

Authentication required: Yes

Request body:

```json
{
  "name": "2026 Season",
  "start_date": "2026-05-01",
  "end_date": "2026-06-30",
  "status": "active"
}
```

Validation rules:

| Field | Rule |
| --- | --- |
| `name` | Required string |
| `start_date` | Required date |
| `end_date` | Required date, must be after or equal to `start_date` |
| `status` | Optional, must be `active` or `done` |

### Show Season

Returns a season with its league, teams, players, games, and game results.

```http
GET /seasons/{season}
```

Authentication required: Yes

### Update Season

Updates season details or status.

```http
PUT /seasons/{season}
PATCH /seasons/{season}
```

Authentication required: Yes

Request body:

```json
{
  "name": "Updated Season",
  "start_date": "2026-05-01",
  "end_date": "2026-07-15",
  "status": "done"
}
```

## Team And Player Endpoints

### List Teams In A Season

Returns all teams in a season.

```http
GET /seasons/{season}/teams
```

Authentication required: Yes

### Create Team

Registers a team in a season.

```http
POST /seasons/{season}/teams
```

Authentication required: Yes

Request body:

```json
{
  "name": "East Hoopers",
  "coach": "Coach East"
}
```

Validation rules:

| Field | Rule |
| --- | --- |
| `name` | Required string |
| `coach` | Optional string |

### Show Team

Returns a team with its season and players.

```http
GET /teams/{team}
```

Authentication required: Yes

### Update Team

Updates a team.

```http
PUT /teams/{team}
PATCH /teams/{team}
```

Authentication required: Yes

Request body:

```json
{
  "name": "Updated Hoopers",
  "coach": "New Coach"
}
```

### Add Player To Team

Adds an existing player to a team or creates a new player and assigns them to the team.

```http
POST /teams/{team}/players
```

Authentication required: Yes

Option 1: Create a new player and add to team.

```json
{
  "name": "Juan Dela Cruz",
  "birthdate": "2000-01-01",
  "position": "Guard",
  "jersey_number": 7
}
```

Option 2: Add an existing player to team.

```json
{
  "player_id": 1,
  "jersey_number": 7
}
```

Validation and business rules:

| Rule | Description |
| --- | --- |
| Player must exist if `player_id` is provided | Prevents invalid player assignment |
| `name` is required if `player_id` is not provided | Needed when creating a new player |
| `jersey_number` is required | Stored on the `player_team` pivot table |
| Player cannot be assigned twice to the same team | Returns `422` |
| Jersey number cannot be duplicated within the same team | Returns `422` |

### Remove Player From Team

Removes a player from a team.

```http
DELETE /teams/{team}/players/{player}
```

Authentication required: Yes

Possible responses:

| Status | Description |
| --- | --- |
| `204` | Player removed from team |
| `401` | Missing or invalid token |
| `404` | Team not found or not owned by user |

## Game And Result Endpoints

### List Games In A Season

Returns all games in a season with home team, away team, result, player stats, and players.

```http
GET /seasons/{season}/games
```

Authentication required: Yes

### Schedule Game

Creates a scheduled game.

```http
POST /seasons/{season}/games
```

Authentication required: Yes

Request body:

```json
{
  "home_team_id": 1,
  "away_team_id": 2,
  "scheduled_at": "2026-05-10 18:00:00",
  "venue": "Barangay Gym"
}
```

Validation and business rules:

| Rule | Description |
| --- | --- |
| `home_team_id` is required | Must exist in the same season |
| `away_team_id` is required | Must exist in the same season |
| Home and away teams must be different | A team cannot play against itself |
| New game defaults to `scheduled` | Game status starts as scheduled |
| Duplicate matchup is rejected | Same two teams cannot be scheduled again in the season, even if home/away order is reversed |
| Same-date conflict is rejected | A team cannot have another game scheduled on the same date |

Possible responses:

| Status | Description |
| --- | --- |
| `201` | Game scheduled |
| `401` | Missing or invalid token |
| `404` | Season not found or not owned by user |
| `422` | Validation or scheduling rule failed |

### Show Game

Returns one game with teams, players, result, player stats, and stat player details.

```http
GET /games/{game}
```

Authentication required: Yes

### Submit Game Result

Submits the final score of a game and marks the game as `done`.

```http
POST /games/{game}/result
```

Authentication required: Yes

Request body:

```json
{
  "home_score": 80,
  "away_score": 70
}
```

Validation rules:

| Field | Rule |
| --- | --- |
| `home_score` | Required integer, minimum `0` |
| `away_score` | Required integer, minimum `0` |

Behavior:

| Action | Description |
| --- | --- |
| Creates or updates game result | Uses the game ID |
| Updates game status | Sets `status` to `done` |

### Submit Player Stats

Submits individual player stats for a completed game.

```http
POST /games/{game}/stats
```

Authentication required: Yes

Request body:

```json
{
  "stats": [
    {
      "player_id": 1,
      "points": 25,
      "assists": 5,
      "rebounds": 8,
      "fouls": 2
    },
    {
      "player_id": 2,
      "points": 18,
      "assists": 3,
      "rebounds": 6,
      "fouls": 1
    }
  ]
}
```

Validation and business rules:

| Rule | Description |
| --- | --- |
| `stats` is required | Must be an array with at least one item |
| Game must be `done` | Stats cannot be submitted before final result |
| Game must have a result | Stats require a game result record |
| Player must exist | Each `player_id` must exist |
| Player must belong to one of the game teams | Prevents stats for unrelated players |
| Numeric stat fields must be non-negative integers | Applies to points, assists, rebounds, and fouls |

Behavior:

| Action | Description |
| --- | --- |
| Deletes existing stats for the result | Prevents duplicate stats |
| Inserts submitted stat rows | Saves the current stat payload |

## Standings, Leaderboard, Summary, And Profile Endpoints

### Season Standings

Returns team win-loss records for a season, sorted by wins descending.

```http
GET /seasons/{season}/standings
```

Authentication required: Yes

Example response:

```json
[
  {
    "team_id": 1,
    "team_name": "East Hoopers",
    "wins": 1,
    "losses": 0,
    "games_played": 1
  },
  {
    "team_id": 2,
    "team_name": "West Shooters",
    "wins": 0,
    "losses": 1,
    "games_played": 1
  }
]
```

Computation rules:

| Rule | Description |
| --- | --- |
| Only completed games are counted | Game status must be `done` |
| A home team wins if `home_score > away_score` | Adds one win to home team |
| An away team wins if `away_score > home_score` | Adds one win to away team |
| Losing team gets one loss | Adds one loss to opponent |
| Ties are ignored in win/loss count | No win or loss is added |

### Player Leaderboard

Returns the top 10 players by total points in a season.

```http
GET /seasons/{season}/leaderboard
```

Authentication required: Yes

Example response:

```json
[
  {
    "player_id": 1,
    "name": "Juan Dela Cruz",
    "total_points": 25
  },
  {
    "player_id": 2,
    "name": "Pedro Santos",
    "total_points": 18
  }
]
```

Computation rules:

| Rule | Description |
| --- | --- |
| Only completed games are counted | Game status must be `done` |
| Points are summed by player | Uses `SUM(player_stats.points)` |
| Results are sorted by points | Highest total first |
| Response is limited to 10 players | Top 10 leaderboard |

### Season Summary

Returns aggregate statistics for a season.

```http
GET /seasons/{season}/summary
```

Authentication required: Yes

Example response:

```json
{
  "total_games_played": 1,
  "total_games_scheduled": 0,
  "top_scoring_team": {
    "team_id": 1,
    "team_name": "East Hoopers",
    "total_points": 80
  },
  "total_points_scored": 150
}
```

Returned fields:

| Field | Description |
| --- | --- |
| `total_games_played` | Number of completed games |
| `total_games_scheduled` | Number of scheduled games not yet completed |
| `top_scoring_team` | Team with highest total score across completed games |
| `total_points_scored` | Total points scored by all teams across completed games |

Possible responses:

| Status | Description |
| --- | --- |
| `200` | Summary returned |
| `404` | Season not found, not owned by user, or no completed games |

### Player Profile

Returns a player's complete career profile for the authenticated user's leagues.

```http
GET /players/{player}/profile
```

Authentication required: Yes

Example response:

```json
{
  "id": 1,
  "name": "Juan Dela Cruz",
  "position": "Guard",
  "teams": [
    {
      "team_id": 1,
      "team_name": "East Hoopers",
      "season_id": 1,
      "season_name": "2026 Season",
      "jersey_number": 7
    }
  ],
  "career_totals": {
    "total_games_played": 1,
    "total_points": 25,
    "total_assists": 5,
    "total_rebounds": 8
  },
  "personal_best_game": {
    "game_id": 1,
    "scheduled_at": "2026-05-10 18:00:00",
    "venue": "Barangay Gym",
    "points": 25
  }
}
```

Returned fields:

| Field | Description |
| --- | --- |
| `id` | Player ID |
| `name` | Player name |
| `position` | Player position |
| `teams` | Teams the player has joined |
| `teams[].season_name` | Season name for that team |
| `teams[].jersey_number` | Jersey number from pivot table |
| `career_totals` | Career totals across completed games |
| `personal_best_game` | Game where the player scored the most points |

Possible responses:

| Status | Description |
| --- | --- |
| `200` | Player profile returned |
| `404` | Player not found or does not belong to authenticated user's teams |

## Recommended Postman Testing Flow

Use this order when testing manually:

1. Register user.
2. Copy the returned token.
3. Add the token to Postman Authorization as Bearer Token.
4. Create a league.
5. Create a season under the league.
6. Create two teams under the season.
7. Add one player to each team.
8. Schedule a game between the two teams.
9. Submit the game result.
10. Submit player stats.
11. Check standings.
12. Check leaderboard.
13. Check season summary.
14. Check player profile.
15. Logout.
16. Try a protected endpoint again to confirm the old token no longer works.

## Full Example Test Data

### Register

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

### League

```json
{
  "name": "Barangay Cup",
  "sport": "Basketball",
  "description": "Summer league"
}
```

### Season

```json
{
  "name": "2026 Season",
  "start_date": "2026-05-01",
  "end_date": "2026-06-30",
  "status": "active"
}
```

### Team 1

```json
{
  "name": "East Hoopers",
  "coach": "Coach East"
}
```

### Team 2

```json
{
  "name": "West Shooters",
  "coach": "Coach West"
}
```

### Player 1

```json
{
  "name": "Juan Dela Cruz",
  "birthdate": "2000-01-01",
  "position": "Guard",
  "jersey_number": 7
}
```

### Player 2

```json
{
  "name": "Pedro Santos",
  "birthdate": "2001-01-01",
  "position": "Forward",
  "jersey_number": 11
}
```

### Game

```json
{
  "home_team_id": 1,
  "away_team_id": 2,
  "scheduled_at": "2026-05-10 18:00:00",
  "venue": "Barangay Gym"
}
```

### Game Result

```json
{
  "home_score": 80,
  "away_score": 70
}
```

### Player Stats

```json
{
  "stats": [
    {
      "player_id": 1,
      "points": 25,
      "assists": 5,
      "rebounds": 8,
      "fouls": 2
    },
    {
      "player_id": 2,
      "points": 18,
      "assists": 3,
      "rebounds": 6,
      "fouls": 1
    }
  ]
}
```

## Ownership And Security Rules

The API scopes league-related data to the authenticated user.

This means:

| Rule | Description |
| --- | --- |
| A user can only see their own leagues | League queries use the authenticated user's relationship |
| A user can only access seasons under their own leagues | Seasons are checked through league ownership |
| A user can only access teams under their own seasons | Teams are checked through season and league ownership |
| A user can only access games under their own seasons | Games are checked through season and league ownership |
| A user can only view player profiles for players connected to their teams | Player lookup is scoped through teams, seasons, and leagues |

## Common Errors

### 401 Unauthenticated

Cause:

The request is missing a Bearer token or the token is invalid.

Fix:

Add this in Postman's Authorization tab:

```text
Type: Bearer Token
Token: YOUR_TOKEN_HERE
```

### 404 Not Found

Cause:

The resource does not exist, or it belongs to another authenticated user.

Fix:

Check that you are using the correct ID and the correct login token.

### 422 Validation Error

Cause:

The request body is missing required fields or violates a business rule.

Examples:

| Error Case | Example |
| --- | --- |
| Missing required field | Creating a league without `name` |
| Invalid season status | Sending `"status": "open"` |
| Same team game | `home_team_id` and `away_team_id` are the same |
| Duplicate matchup | Scheduling Team A vs Team B twice |
| Stats before result | Submitting stats before game status is `done` |
| Invalid player stats | Submitting stats for a player not assigned to the game teams |

## Notes For Developers

Useful commands:

```bash
php artisan serve
php artisan migrate
php artisan migrate:fresh
php artisan route:list
php artisan test
```

If the project is run locally, make sure the PHP version satisfies the version required in `composer.json`.

