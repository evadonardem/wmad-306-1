# Barangay Sport League API — Route Map

**API Base:** `http://127.0.0.1/api` or `http://localhost/api`

**Total Routes:** 40

---

## Authentication (No Auth Required)

| Method | Endpoint | Controller | Purpose |
|--------|----------|-----------|---------|
| `POST` | `/register` | AuthController@register | Register new user |
| `POST` | `/login` | AuthController@login | Login → get Sanctum token |

---

## Auth (Sanctum Bearer Token Required)

### Current Authenticated User

| Method | Endpoint | Controller | Purpose |
|--------|----------|-----------|---------|
| `GET` | `/user` | AuthController@user | Get authenticated user profile |
| `POST` | `/logout` | AuthController@logout | Revoke current token |

---

### Users (Admin/List)

| Method | Endpoint | Controller | Purpose |
|--------|----------|-----------|---------|
| `GET` | `/users` | UserController@index | List all users |
| `GET` | `/users/{user}` | UserController@show | Get user by ID |

---

### Leagues

| Method | Endpoint | Controller | Purpose |
|--------|----------|-----------|---------|
| `GET` | `/leagues` | LeagueController@index | List leagues |
| `POST` | `/leagues` | LeagueController@store | Create league |
| `GET` | `/leagues/{league}` | LeagueController@show | Get league |
| `PUT` | `/leagues/{league}` | LeagueController@update | Update league |
| `DELETE` | `/leagues/{league}` | LeagueController@destroy | Delete league |

---

### Seasons

| Method | Endpoint | Controller | Purpose |
|--------|----------|-----------|---------|
| `GET` | `/leagues/{league}/seasons` | SeasonController@index | List seasons in league |
| `POST` | `/leagues/{league}/seasons` | SeasonController@store | Create season in league |
| `GET` | `/seasons/{season}` | SeasonController@show | Get season |
| `PUT` | `/seasons/{season}` | SeasonController@update | Update season |

---

### Season Resources (Teams, Games, Standings, Leaderboard)

| Method | Endpoint | Controller | Purpose |
|--------|----------|-----------|---------|
| `GET` | `/seasons/{season}/teams` | TeamController@index | List teams in season |
| `POST` | `/seasons/{season}/teams` | TeamController@store | Create team in season |
| `GET` | `/seasons/{season}/games` | GameController@index | List games in season |
| `POST` | `/seasons/{season}/games` | GameController@store | Create game in season |
| `GET` | `/seasons/{season}/standings` | StandingsController@standings | Get season standings |
| `GET` | `/seasons/{season}/leaderboard` | StandingsController@leaderboard | Get season leaderboard |

---

### Teams

| Method | Endpoint | Controller | Purpose |
|--------|----------|-----------|---------|
| `GET` | `/teams` | TeamController@index | List all teams |
| `POST` | `/teams` | TeamController@store | Create team |
| `GET` | `/teams/{team}` | TeamController@show | Get team |
| `PUT` | `/teams/{team}` | TeamController@update | Update team |
| `DELETE` | `/teams/{team}` | TeamController@destroy | Delete team |
| `POST` | `/teams/{team}/players` | TeamController@addPlayer | Add player to team |
| `DELETE` | `/teams/{team}/players/{player}` | TeamController@removePlayer | Remove player from team |

---

### Players

| Method | Endpoint | Controller | Purpose |
|--------|----------|-----------|---------|
| `GET` | `/players` | PlayerController@index | List all players |
| `POST` | `/players` | PlayerController@store | Create player |
| `GET` | `/players/{player}` | PlayerController@show | Get player |
| `PUT` | `/players/{player}` | PlayerController@update | Update player |
| `DELETE` | `/players/{player}` | PlayerController@destroy | Delete player |

---

### Games & Results

| Method | Endpoint | Controller | Purpose |
|--------|----------|-----------|---------|
| `GET` | `/games` | GameController@index | List all games |
| `POST` | `/games` | GameController@store | Create game |
| `GET` | `/games/{game}` | GameController@show | Get game |
| `PUT` | `/games/{game}` | GameController@update | Update game |
| `DELETE` | `/games/{game}` | GameController@destroy | Delete game |
| `POST` | `/games/{game}/result` | GameController@submitResult | Submit game result (score) |
| `POST` | `/games/{game}/stats` | GameController@submitStats | Submit player stats for game |

---

## Key Points

1. **Authenticated User Endpoint:** `GET /api/user` (NOT `POST`)
   - Returns the current Bearer-token user
   - Header: `Authorization: Bearer <token>`

2. **User List Endpoint:** `GET /api/users`
   - Returns all users in the system
   - Different from `/api/user`

3. **Login Flow:**
   - `POST /api/login` with credentials → returns token in `data.token`
   - Pass token as `Authorization: Bearer <token>` in protected endpoints

4. **All Protected Routes:**
   - Require `Authorization: Bearer <token>` header
   - Use `auth:sanctum` middleware
   - Return 401 if token is invalid/expired

5. **Database Models:**
   - User, League, Season, Team, Player, Game, GameResult, PlayerStat
   - Relationships: User → Leagues → Seasons → Teams/Games → Results/Stats

---

## Sample cURL Requests

**Login:**
```bash
curl -X POST http://127.0.0.1/api/login \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{"email":"admin@example.com","password":"password"}'
```

**Get Authenticated User:**
```bash
TOKEN="<paste-token-from-login>"
curl -X GET http://127.0.0.1/api/user \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Accept: application/json'
```

**List Leagues:**
```bash
TOKEN="<paste-token-from-login>"
curl -X GET http://127.0.0.1/api/leagues \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Accept: application/json'
```

---

## Postman Import

1. Import `backend/postman/barangay_sport_league_api_bugtong.postman_collection.json` into Postman
2. Set environment variable `baseUrl` to `http://127.0.0.1` or `http://localhost`
3. Run "Login (sets token)" request first—it will auto-populate `{{token}}`
4. All subsequent requests use `{{token}}` in the Authorization header

---

**Last Updated:** 2026-05-02
