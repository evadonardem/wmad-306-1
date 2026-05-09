# Barangay Sport League API

A Laravel-based API for managing barangay sport leagues, teams, players, games, and standings.

## Features

- User authentication with Sanctum
- League, season, team, and player management
- Game scheduling and result tracking
- Player statistics and standings
- RESTful API endpoints

## Setup Instructions

1. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database Setup**
   ```bash
   # Configure your database in .env file
   php artisan migrate
   php artisan db:seed  # Optional: seed sample data
   ```

4. **Build Assets**
   ```bash
   npm run build
   ```

5. **Start the Server**
   ```bash
   php artisan serve
   ```

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/me` - Get current user

### Leagues
- `GET /api/leagues` - List leagues
- `POST /api/leagues` - Create league
- `GET /api/leagues/{id}` - Show league
- `PUT /api/leagues/{id}` - Update league
- `DELETE /api/leagues/{id}` - Delete league

### Seasons
- `GET /api/leagues/{league}/seasons` - List seasons
- `POST /api/leagues/{league}/seasons` - Create season
- `GET /api/seasons/{id}` - Show season
- `PUT /api/seasons/{id}` - Update season
- `DELETE /api/seasons/{id}` - Delete season

### Teams
- `GET /api/seasons/{season}/teams` - List teams
- `POST /api/seasons/{season}/teams` - Create team
- `GET /api/teams/{id}` - Show team
- `PUT /api/teams/{id}` - Update team
- `DELETE /api/teams/{id}` - Delete team

### Games
- `GET /api/seasons/{season}/games` - List games
- `POST /api/seasons/{season}/games` - Create game
- `GET /api/games/{id}` - Show game
- `PUT /api/games/{id}` - Update game
- `DELETE /api/games/{id}` - Delete game
- `POST /api/games/{id}/result` - Record game result
- `GET /api/games/{id}/result` - Get game result

### Players
- `GET /api/players` - List players
- `POST /api/players` - Create player
- `GET /api/players/{id}` - Show player
- `PUT /api/players/{id}` - Update player
- `DELETE /api/players/{id}` - Delete player
- `GET /api/players/{id}/profile` - Get player profile

### Standings
- `GET /api/seasons/{season}/standings` - Get standings
- `GET /api/seasons/{season}/top-scorers` - Get top scorers

## Testing

Run the test suite:
```bash
php artisan test
```

## Notes

- All API endpoints require authentication except registration and login
- The homepage is accessible at `/` and uses static assets for reliability
- Database migrations are included for all tables
- Sample data can be seeded for testing

## Requirements

- PHP 8.3+
- Composer
- Node.js & npm
- MySQL or compatible database
