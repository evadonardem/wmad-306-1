# Barangay Sports League API - Complete Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
This API uses Laravel Sanctum for token-based authentication. All requests (except `/register` and `/login`) require an `Authorization: Bearer {token}` header.

---

## 1. AUTHENTICATION ENDPOINTS

### Register
**POST** `/register`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

Response (201):
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "1|abc123..."
}
```

### Login
**POST** `/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "1|abc123..."
}
```

### Get Current User
**GET** `/user`

Headers:
```
Authorization: Bearer {token}
```

Response (200):
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Logout
**POST** `/logout`

Headers:
```
Authorization: Bearer {token}
```

Response (200):
```json
{
  "message": "Logged out successfully"
}
```

---

## 2. LEAGUES ENDPOINTS

### List All Leagues
**GET** `/leagues`

Response:
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "name": "City Basketball League",
      "description": "Main basketball league",
      "location": "Manila",
      "created_at": "2026-05-08T...",
      "updated_at": "2026-05-08T..."
    }
  ]
}
```

### Create League
**POST** `/leagues`

Request:
```json
{
  "name": "City Basketball League",
  "description": "Main basketball league",
  "location": "Manila"
}
```

Response (201):
```json
{
  "data": {
    "id": 1,
    "user_id": 1,
    "name": "City Basketball League",
    "description": "Main basketball league",
    "location": "Manila"
  },
  "message": "League created successfully"
}
```

### Show League
**GET** `/leagues/{id}`

Response:
```json
{
  "data": {
    "id": 1,
    "user_id": 1,
    "name": "City Basketball League",
    "description": "Main basketball league",
    "location": "Manila",
    "seasons": [...],
    "games": [...]
  }
}
```

### Update League
**PUT/PATCH** `/leagues/{id}`

Request:
```json
{
  "name": "Updated League Name"
}
```

Response:
```json
{
  "data": {...},
  "message": "League updated successfully"
}
```

### Delete League
**DELETE** `/leagues/{id}`

Response:
```json
{
  "message": "League deleted successfully"
}
```

---

## 3. SEASONS ENDPOINTS

### List Seasons for League
**GET** `/leagues/{league_id}/seasons`

Response:
```json
{
  "data": [
    {
      "id": 1,
      "league_id": 1,
      "name": "Spring 2026",
      "year": 2026,
      "start_date": "2026-03-01",
      "end_date": "2026-05-31",
      "status": "active"
    }
  ]
}
```

### Create Season
**POST** `/leagues/{league_id}/seasons`

Request:
```json
{
  "name": "Spring 2026",
  "year": 2026,
  "start_date": "2026-03-01",
  "end_date": "2026-05-31",
  "status": "upcoming"
}
```

Response (201):
```json
{
  "data": {...},
  "message": "Season created successfully"
}
```

### Show Season
**GET** `/leagues/{league_id}/seasons/{season_id}`

Response includes teams and games for the season.

### Update Season
**PUT/PATCH** `/leagues/{league_id}/seasons/{season_id}`

### Delete Season
**DELETE** `/leagues/{league_id}/seasons/{season_id}`

### Add Team to Season
**POST** `/leagues/{league_id}/seasons/{season_id}/add-team`

Request:
```json
{
  "team_id": 1
}
```

Response:
```json
{
  "message": "Team added to season successfully",
  "data": {...}
}
```

---

## 4. TEAMS ENDPOINTS

### List All Teams
**GET** `/teams`

Response:
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Warriors",
      "code": "WAR",
      "description": "Local team",
      "players": [],
      "seasons": []
    }
  ]
}
```

### Create Team
**POST** `/teams`

Request:
```json
{
  "name": "Warriors",
  "code": "WAR",
  "description": "Local team"
}
```

Response (201):
```json
{
  "data": {...},
  "message": "Team created successfully"
}
```

### Show Team
**GET** `/teams/{id}`

### Update Team
**PUT/PATCH** `/teams/{id}`

### Delete Team
**DELETE** `/teams/{id}`

---

## 5. PLAYERS ENDPOINTS

### List Players for Team
**GET** `/teams/{team_id}/players`

Response:
```json
{
  "data": [
    {
      "id": 1,
      "team_id": 1,
      "name": "Juan Dela Cruz",
      "jersey_number": 5,
      "position": "Guard",
      "height_cm": 175,
      "contact": "09123456789"
    }
  ]
}
```

### Create Player
**POST** `/teams/{team_id}/players`

Request:
```json
{
  "name": "Juan Dela Cruz",
  "jersey_number": 5,
  "position": "Guard",
  "height_cm": 175,
  "contact": "09123456789"
}
```

Response (201):
```json
{
  "data": {...},
  "message": "Player created successfully"
}
```

### Show Player
**GET** `/teams/{team_id}/players/{player_id}`

### Update Player
**PUT/PATCH** `/teams/{team_id}/players/{player_id}`

### Delete Player
**DELETE** `/teams/{team_id}/players/{player_id}`

---

## 6. GAMES ENDPOINTS

### List Games for Season
**GET** `/seasons/{season_id}/games`

Response:
```json
{
  "data": [
    {
      "id": 1,
      "season_id": 1,
      "home_team_id": 1,
      "away_team_id": 2,
      "scheduled_at": "2026-03-15T18:00:00",
      "location": "Main Arena",
      "status": "scheduled"
    }
  ]
}
```

### Schedule Game
**POST** `/seasons/{season_id}/games`

Request:
```json
{
  "home_team_id": 1,
  "away_team_id": 2,
  "scheduled_at": "2026-03-15 18:00:00",
  "location": "Main Arena"
}
```

Response (201):
```json
{
  "data": {...},
  "message": "Game scheduled successfully"
}
```

### Show Game
**GET** `/seasons/{season_id}/games/{game_id}`

### Update Game
**PUT/PATCH** `/seasons/{season_id}/games/{game_id}`

### Delete Game
**DELETE** `/seasons/{season_id}/games/{game_id}`

---

## 7. GAME RESULTS & PLAYER STATS ENDPOINTS

### Record Game Result and Player Stats
**POST** `/seasons/{season_id}/games/{game_id}/result`

Request:
```json
{
  "home_team_score": 85,
  "away_team_score": 78,
  "player_stats": [
    {
      "player_id": 1,
      "points": 25,
      "rebounds": 5,
      "assists": 3,
      "steals": 2,
      "blocks": 1,
      "fouls": 3
    },
    {
      "player_id": 2,
      "points": 15,
      "rebounds": 8,
      "assists": 2,
      "steals": 1,
      "blocks": 0,
      "fouls": 4
    }
  ]
}
```

Response (201):
```json
{
  "data": {
    "game": {...},
    "result": {...},
    "playerStats": [...]
  },
  "message": "Game result recorded successfully"
}
```

### Show Game Result
**GET** `/seasons/{season_id}/games/{game_id}/result`

Response:
```json
{
  "data": {
    "game": {...},
    "result": {
      "id": 1,
      "game_id": 1,
      "home_team_score": 85,
      "away_team_score": 78
    },
    "player_stats": [...]
  }
}
```

---

## 8. STANDINGS ENDPOINTS

### Get Season Standings
**GET** `/seasons/{season_id}/standings`

Response:
```json
{
  "season": "Spring 2026",
  "year": 2026,
  "standings": [
    {
      "team_id": 1,
      "name": "Warriors",
      "code": "WAR",
      "wins": 5,
      "losses": 2,
      "games_played": 7,
      "win_percentage": 71.43
    },
    {
      "team_id": 2,
      "name": "Lakers",
      "code": "LAK",
      "wins": 4,
      "losses": 3,
      "games_played": 7,
      "win_percentage": 57.14
    }
  ]
}
```

---

## 9. LEADERBOARD ENDPOINTS

### Get Season Leaderboard (All Players)
**GET** `/seasons/{season_id}/leaderboard`

Response:
```json
{
  "season": "Spring 2026",
  "year": 2026,
  "leaderboard": [
    {
      "player_id": 1,
      "name": "Juan Dela Cruz",
      "team": "Warriors",
      "jersey_number": 5,
      "games_played": 5,
      "points": 125,
      "rebounds": 25,
      "assists": 15,
      "steals": 10,
      "blocks": 5,
      "ppg": 25.0,
      "rpg": 5.0,
      "apg": 3.0
    }
  ]
}
```

### Get Team Leaderboard
**GET** `/teams/{team_id}/leaderboard`

Response:
```json
{
  "team": "Warriors",
  "leaderboard": [
    {
      "player_id": 1,
      "name": "Juan Dela Cruz",
      "jersey_number": 5,
      "position": "Guard",
      "games_played": 5,
      "points": 125,
      "rebounds": 25,
      "assists": 15,
      "steals": 10,
      "blocks": 5,
      "ppg": 25.0,
      "rpg": 5.0,
      "apg": 3.0
    }
  ]
}
```

---

## Testing the API with Postman

1. **Register a user** → Get API token
2. **Add token** to Authorization header for all subsequent requests
3. **Create a league** 
4. **Create teams**
5. **Create a season**
6. **Add teams to season**
7. **Create players**
8. **Schedule games**
9. **Record game results and player stats**
10. **View standings**
11. **View leaderboards**

---

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error description"
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 422: Unprocessable Entity
- 500: Internal Server Error
