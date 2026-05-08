# Barangay Sports League API

A complete REST API backend for managing community basketball league operations, built with Laravel 11 and Laravel Sanctum.

## Project Overview

This project implements a fully functional REST API for a community basketball league management system. It handles authentication, league management, teams, players, game scheduling, results tracking, and statistical analysis.

## Features Implemented

### ✅ Authentication System
- User registration with email validation
- Token-based authentication using Laravel Sanctum
- Secure login/logout endpoints
- User context for resource ownership

### ✅ League Management
- Create, read, update, delete leagues
- Each league belongs to an authenticated user
- Organize multiple seasons per league

### ✅ Seasons
- Create seasons for a league with date ranges
- Track season status (upcoming, active, completed)
- Manage teams within a season

### ✅ Teams
- Create and manage teams
- Add/remove players
- Track team participation in seasons

### ✅ Players
- Register players with jersey numbers and positions
- Store player contact information and physical attributes
- Track player statistics across games

### ✅ Game Scheduling
- Schedule games within a season
- Verify team eligibility
- Track game status (scheduled, ongoing, completed, cancelled)

### ✅ Game Results & Stats
- Record game final scores
- Submit player performance statistics
- Automatically update team standings based on results
- Calculate win-loss records

### ✅ Standings
- Compute win-loss records per team
- Calculate win percentage
- Sort standings by performance

### ✅ Leaderboards
- Aggregate player statistics across games
- Season-level leaderboards (all players)
- Team-level leaderboards
- Calculate PPG, RPG, APG per player

## Database Schema

### Tables Created
- **users** - User accounts and authentication
- **leagues** - Basketball leagues
- **seasons** - Seasons within leagues
- **teams** - Basketball teams
- **players** - Individual players
- **season_team** - Pivot table for team enrollment in seasons
- **games** - Scheduled games
- **game_results** - Final scores for completed games
- **player_stats** - Individual player performance per game

## API Endpoints

### Authentication
```
POST   /api/register      - Register new user
POST   /api/login         - Login user
POST   /api/logout        - Logout user (requires auth)
GET    /api/user          - Get current user (requires auth)
```

### Leagues
```
GET    /api/leagues                 - List all leagues
POST   /api/leagues                 - Create league
GET    /api/leagues/{id}            - Show league
PUT    /api/leagues/{id}            - Update league
DELETE /api/leagues/{id}            - Delete league
```

### Seasons
```
GET    /api/leagues/{league}/seasons              - List seasons
POST   /api/leagues/{league}/seasons              - Create season
GET    /api/leagues/{league}/seasons/{season}     - Show season
PUT    /api/leagues/{league}/seasons/{season}     - Update season
DELETE /api/leagues/{league}/seasons/{season}     - Delete season
POST   /api/leagues/{league}/seasons/{season}/add-team - Add team to season
```

### Teams
```
GET    /api/teams         - List all teams
POST   /api/teams         - Create team
GET    /api/teams/{id}    - Show team
PUT    /api/teams/{id}    - Update team
DELETE /api/teams/{id}    - Delete team
```

### Players
```
GET    /api/teams/{team}/players            - List players
POST   /api/teams/{team}/players            - Create player
GET    /api/teams/{team}/players/{player}   - Show player
PUT    /api/teams/{team}/players/{player}   - Update player
DELETE /api/teams/{team}/players/{player}   - Delete player
```

### Games
```
GET    /api/seasons/{season}/games          - List games
POST   /api/seasons/{season}/games          - Schedule game
GET    /api/seasons/{season}/games/{game}   - Show game
PUT    /api/seasons/{season}/games/{game}   - Update game
DELETE /api/seasons/{season}/games/{game}   - Delete game
```

### Game Results & Stats
```
POST   /api/seasons/{season}/games/{game}/result - Record result
GET    /api/seasons/{season}/games/{game}/result - Show result
```

### Standings & Leaderboards
```
GET    /api/seasons/{season}/standings        - Season standings
GET    /api/seasons/{season}/leaderboard      - Season leaderboard
GET    /api/teams/{team}/leaderboard          - Team leaderboard
```

## Technology Stack

- **Framework**: Laravel 11
- **Authentication**: Laravel Sanctum 4.3.1
- **Database**: MySQL 8.0
- **Server**: PHP 8.3-FPM with Nginx
- **Containerization**: Docker & Docker Compose
- **CSS Framework**: Tailwind CSS v4.0.0

## Project Structure

```
barangay_sport_league_api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php
│   │   │       ├── LeagueController.php
│   │   │       ├── SeasonController.php
│   │   │       ├── TeamController.php
│   │   │       ├── PlayerController.php
│   │   │       ├── GameController.php
│   │   │       ├── GameResultController.php
│   │   │       ├── StandingsController.php
│   │   │       └── LeaderboardController.php
│   │   └── Policies/
│   │       ├── LeaguePolicy.php
│   │       └── TeamPolicy.php
│   └── Models/
│       ├── User.php
│       ├── League.php
│       ├── Season.php
│       ├── Team.php
│       ├── Player.php
│       ├── Game.php
│       ├── GameResult.php
│       └── PlayerStats.php
├── database/
│   ├── migrations/
│   │   ├── 2026_05_08_000001_create_leagues_table.php
│   │   ├── 2026_05_08_000002_create_seasons_table.php
│   │   ├── 2026_05_08_000003_create_teams_table.php
│   │   ├── 2026_05_08_000004_create_players_table.php
│   │   ├── 2026_05_08_000005_create_season_team_table.php
│   │   ├── 2026_05_08_000006_create_games_table.php
│   │   ├── 2026_05_08_000007_create_game_results_table.php
│   │   └── 2026_05_08_000008_create_player_stats_table.php
│   └── factories/
└── routes/
    └── api.php
```

## Getting Started

### Prerequisites
- Docker & Docker Compose installed
- Git

### Setup & Running

1. **Start the Docker containers:**
   ```bash
   docker compose up -d
   ```

2. **Access the API:**
   - API Base URL: `http://localhost:8080/api`
   - Landing Page: `http://localhost:8080/`

3. **Register a user:**
   ```bash
   POST /api/register
   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "password123",
     "password_confirmation": "password123"
   }
   ```

4. **Use the token** from registration response in all subsequent requests with the header:
   ```
   Authorization: Bearer {token}
   ```

## Key Implementation Details

### Authorization
- User-based authorization using Laravel Policies
- Each league and team belongs to a specific user
- Users can only manage their own resources

### Database Relationships
- **User** `hasMany` **Leagues** and **Teams**
- **League** `hasMany` **Seasons**
- **Season** `belongsToMany` **Teams** (with pivot data: wins, losses)
- **Team** `hasMany` **Players** and **Games**
- **Game** `belongsTo` **Seasons**, `belongsTo` **HomeTeam** & **AwayTeam**
- **Player** `belongsTo` **Team**, `hasMany` **Stats**
- **PlayerStats** aggregates performance across games

### Business Logic
- Games can only be scheduled for teams enrolled in the season
- Game results automatically update team standings
- Standings computed dynamically from game results
- Leaderboards aggregate player stats across completed games
- Support for tied games and draws

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete endpoint documentation with examples.

## Development Notes

- All API responses use JSON format
- Standard HTTP status codes (200, 201, 400, 401, 404, 422, 500)
- Input validation on all endpoints
- Transaction support for game result submissions
- Sanctum token-based stateless authentication

## Future Enhancements

- [ ] Game statistics video/photo uploads
- [ ] Real-time game updates via WebSockets
- [ ] League invitations and team management
- [ ] Advanced player analytics and heatmaps
- [ ] Mobile app integration
- [ ] Referee/staff management
- [ ] Venue management system
- [ ] Sponsorship tracking

## Support

For issues or questions, refer to the API_DOCUMENTATION.md file or check the Laravel documentation at https://laravel.com/docs
