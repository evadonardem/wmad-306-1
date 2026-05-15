# Barangay Sport League API Evaluation Results

**Total Credited Points:** 120

**Bonus Max Credit Points:** 10

**Due:** 30-Apr-2026

## Summary Table

| Student | Core | Exercises | Bonus Points | Total Score | Deduction % | Final Score |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Ancheta | 95 | 25 | 10 | 130 | 15% | 110.5 |
| Botay | 60 | 15 | 0 | 75 | 60% | 30 |
| Bustamante | 95 | 25 | 10 | 130 | 15% | 110.5 |
| Dulnuan | 95 | 22 | 2 | 119 | 40% | 71.4 |
| Fernandez | 95 | 25 | 10 | 130 | 15% | 110.5 |
| Rivera | 95 | 25 | 10 | 130 | 15% | 110.5 |
| Sueno | 67 | 20 | 0 | 87 | 15% | 73.95 |
| Teligo | 95 | 25 | 5 | 125 | 15% | 106.25 |

## Detailed Evaluations

### barangay_sport_league_api_ancheta
- **Panel A Findings**: 
    - Success: All 9 migrations created correctly.
    - Success: `player_team` pivot table implemented with `jersey_number`.
    - Success: All 8 models implement correct relationships.
    - Success: `withPivot('jersey_number')` used in `Player.php` and `Team.php`.
- **Panel B Findings**: 
    - Success: Sanctum authentication fully implemented in `AuthController.php` with correct token return on login.
    - Success: All protected routes correctly wrapped in `auth:sanctum` middleware.
    - Success: `LeagueController` strictly scopes all queries to the authenticated user.
    - Success: Game scheduling validates that teams belong to the same season and prevents self-play.
    - Success: `GameController::submitStats` enforces that games must have status 'done' before stats are accepted.
- **Panel C Findings**: 
    - Success: Standings calculate W-L records and sort by wins.
    - Success: Leaderboard aggregates top 10 players by total points.
    - Success: Ex 1 implemented in `SeasonSummaryController.php` with all 4 aggregates.
    - Success: Ex 2 implemented in `GameController.php` with order-independent matchup and date conflict validation (422).
    - Success: Ex 3 implemented in `PlayerProfileController.php` with career totals and personal best game.
- **Bonus Justification**: Awarded full bonus for exceptional architectural quality, use of database transactions for data integrity in result/stat submission, and clean, professional code structure.
- **Final Grade**: **130 / 120**
- **Feedback**: Outstanding implementation. The API is robust, follows all requirements perfectly, and demonstrates a high level of engineering maturity.

### barangay_sport_league_api_botay
- **Panel A Findings**: 
    - Failure: Missing `player_team` pivot table. Instead, uses a `team_id` on the `players` table, restricting players to a single team across all time.
    - Failure: `Player` model uses `belongsTo` instead of `belongsToMany`, violating the project specification.
    - Failure: `teams` table uses `user_id` instead of `season_id`, breaking the requirement that teams are specific to a season.
    - Success: Basic league and season migrations are present.
- **Panel B Findings**: 
    - Success: Sanctum authentication implemented correctly in `AuthController.php`.
    - Success: Route protection is correctly applied in `api.php`.
    - Success: `LeagueController` scopes index and store to the authenticated user.
- **Panel C Findings**: 
    - Partial: Standings and Leaderboard endpoints are defined, but their logic is likely compromised by the flawed database schema (e.g., team-season relationship).
- **Bonus Justification**: No bonus points awarded due to critical architectural failures in the data layer.
- **Final Grade**: **75 / 120**
- **Feedback**: The API authentication and basic routing are well-done, but there is a fundamental misunderstanding of the data model. The relationship between players, teams, and seasons must be implemented using pivot tables as specified in the rubric to support multi-season tracking and jersey numbers.

### barangay_sport_league_api_bustamante
- **Panel A Findings**: 
    - Success: All 9 required tables are present. The `player_team` pivot table correctly includes `jersey_number` and uses a composite primary key.
    - Success: All 8 models are implemented with correct Eloquent relationships. The `Team` and `Player` models properly utilize `withPivot('jersey_number')`.
    - Success: Foreign key constraints are correctly defined across all tables.
- **Panel B Findings**: 
    - Success: Implemented Laravel Sanctum. `AuthController` provides register, login (returning plain-text token), and logout functionality.
    - Success: All sensitive endpoints are correctly wrapped in the `auth:sanctum` middleware.
    - Success: `LeagueController` strictly scopes all queries to the authenticated user using `$request->user()->leagues()`.
    - Success: `GameController@store` prevents self-play, ensures both teams belong to the same season, and prevents duplicate matchups regardless of home/away order.
    - Success: Date conflict validation prevents a team from being scheduled for two games on the same date.
    - Success: `GameController@submitStats` restricts submissions to games with a 'done' status.
- **Panel C Findings**: 
    - Success: Standings correctly calculated (W-L) and sorted by wins. Leaderboard correctly aggregates top 10 players.
    - Success: Ex 1 (Season Summary) provides all 4 required aggregates.
    - Success: Ex 2 (Game Validation) implements duplicate matchup and date conflict validations with 422 responses.
    - Success: Ex 3 (Player Profile) provides comprehensive profile including career totals and personal best game.
- **Bonus Justification**: +10 Points. Exceptional validation logic for game scheduling (date conflict and order-independent duplicate check) and professional code organization.
- **Final Grade**: **130 / 120**
- **Feedback**: Excellent work. Your implementation is one of the most robust seen, particularly the game scheduling validation and the clean organization of your controllers.

### barangay_sport_league_api_dulnuan
- **Panel A Findings**: 
    - Success: All 9 required tables are present with correct foreign key constraints.
    - Success: `player_team` pivot table correctly implements `jersey_number` with uniqueness constraints.
    - Success: All 8 models are implemented with correct Eloquent relationships.
    - Success: `Player` and `Team` models correctly utilize `withPivot('jersey_number')`.
- **Panel B Findings**: 
    - Success: Laravel Sanctum correctly implemented for registration, login, and logout.
    - Success: All protected routes correctly wrapped in `auth:sanctum` middleware.
    - Success: Strict league scoping enforced in `LeagueController`.
    - Success: Game scheduling includes required validations (same season, no self-play).
    - Success: Ex 2 (Game Validation) fully implemented, rejecting duplicate matchups and date conflicts.
    - Success: Player stats restricted to games with a 'done' status.
- **Panel C Findings**: 
    - Success: Standings correctly calculated and sorted by wins.
    - Success: Leaderboard correctly aggregates top 10 players.
    - Success: Ex 1 (Season Summary) fully implemented.
    - Partial Success: Ex 3 (Player Profile) returns basic info and career totals, but fails to provide the "personal best game".
    - Success: API returns appropriate HTTP status codes.
- **Bonus Justification**: Awarded 2 points for clean `GameController` implementation and use of `DB::transaction` for result/stat submissions.
- **Final Grade**: **119 / 120**
- **Feedback**: Great job on the overall implementation! Your infrastructure is solid, and your API security and scoping are spot on. Ensure all requirements for the Exercise endpoints are met in the future.

### barangay_sport_league_api_fernandez
- **Panel A Findings**: 
    - Success: All 9 required migrations are implemented with correct foreign key constraints.
    - Success: `player_team` pivot table correctly enforces uniqueness for team/player and team/jersey combinations.
    - Success: All models correctly defined. `Team` and `Player` models correctly utilize `withPivot('jersey_number')`.
- **Panel B Findings**: 
    - Success: Authentication robustly implemented using Laravel Sanctum.
    - Success: Route protection strictly applied via `auth:sanctum` middleware.
    - Success: Strict league scoping implemented via architectural helper methods in the base `Controller`.
    - Success: Game scheduling logic exemplary, with validations for self-play, duplicate matchups, and date conflicts.
- **Panel C Findings**: 
    - Success: Core endpoints for Standings and Leaderboards are fully functional and correctly sorted.
    - Success: Ex 1 (Season Summary) provides all 4 required aggregates.
    - Success: Ex 2 (Game Validation) is fully implemented.
    - Success: Ex 3 (Player Profile) correctly calculates career totals and identifies the personal best game.
- **Bonus Justification**: +10 Points. Superior architectural pattern for resource scoping, provided dedicated API documentation, and implemented complex business rules for game scheduling.
- **Final Grade**: **130 / 120**
- **Feedback**: This is an outstanding implementation. Your attention to detail regarding database constraints and the architectural decision to centralize scoping logic in the base controller are professional-grade.

### barangay_sport_league_api_rivera
- **Panel A Findings**: 
    - Success: All 9 required tables are present with correct constraints. `player_team` pivot correctly implements `jersey_number`.
    - Success: All models correctly defined. `Team` and `Player` models implement `belongsToMany` with `withPivot('jersey_number')`.
    - Success: Foreign keys consistently implemented with `cascadeOnDelete()`.
- **Panel B Findings**: 
    - Success: Laravel Sanctum correctly implemented.
    - Success: Route protection properly wrapped in `auth:sanctum` middleware.
    - { "comment": "This part was repeated in my output" }
    - Success: Strict scoping to the authenticated user enforced in `LeagueController`.
    - Success: `GameController@store` implements all required validations: same-season check, no self-play, duplicate matchup prevention, and date conflict detection.
    - Success: Stats submission restricted to games with a 'done' status.
- **Panel C Findings**: 
    - Success: Standings correctly calculated and sorted by wins. Leaderboard correctly retrieves top 10 players.
    - Success: Ex 1 (Season Summary) implemented and returns 4 required aggregates.
    - Success: Ex 2 (Game Validation) fully implemented.
    - Success: Ex 3 (Player Profile) provides career totals and personal best game.
- **Bonus Justification**: +10 Points. Comprehensive integration test `BarangaySportsLeagueApiTest.php` covering the entire API lifecycle, and excellent use of helper methods for resource scoping.
- **Final Grade**: **130 / 130**
- **Feedback**: Exceptional implementation. The API is robust, securely scoped, and the integration test demonstrates a high level of professional rigor.

### barangay_sport_league_api_sueno
- **Panel A Findings**: 
    - Success: All 9 core migrations are present, including the `player_team` pivot table with `jersey_number`.
    - Success: All required Eloquent models are implemented with correct relationships. Team-Player relationship correctly utilizes `withPivot('jersey_number')`.
    - Success: Database constraints are properly defined.
- **Panel B Findings**: 
    - Success: Authentication is correctly implemented using Laravel Sanctum.
    - Success: All protected routes are wrapped within the `auth:sanctum` middleware group.
    - Success: `LeagueController` correctly scopes all queries to the authenticated user.
    - Success: Game scheduling logic in `GameController@store` validates teams in same season, rejects duplicate matchups and date conflicts.
    - Success: Player stats submission in `GameController@stats` ensures the game is finished before allowing entry.
    - Failure: Critical Security Flaw: Lack of scoping in `SeasonController`, `TeamController`, and `GameController`. These controllers use `Season::find($id)` or `League::find($id)` directly, allowing any authenticated user to access or modify data from any league/season regardless of ownership.
- **Panel C Findings**: 
    - Success: `GameController@leaderboard` correctly aggregates total points and returns top 10 players.
    - Success: Ex 1 (Season Summary) implemented correctly.
    - Success: Ex 2 (Game Validation) implemented correctly.
    - Partial Failure: Ex 3 (Player Profile) provides basic info and team history, but fails to provide comprehensive career totals and is missing the "personal best game".
    - Failure: Standings: W-L records are calculated but returned as an unsorted array. Rubric requires sorting by wins.
- **Bonus Justification**: No bonus points awarded.
- **Final Grade**: **87 / 120**
- **Feedback**: Your implementation of the core logic and validation rules is strong, but you have a critical security vulnerability: the `Season`, `Team`, and `Game` controllers are not scoped to the authenticated user's leagues. This means any registered user can modify any other user's league data. Always ensure that your queries start from the authenticated user's relationship to prevent unauthorized data access.

### barangay_sport_league_api_teligo
- **Panel A Findings**: 
    - Success: All 9 required migrations are present with correct constraints. The `player_team` pivot table is correctly implemented with `jersey_number`.
    - Success: All 8 models are implemented with correct Eloquent relationships. Team-Player relationship correctly uses `withPivot('jersey_number')`.
    - **Panel B Findings**: 
    - Success: Laravel Sanctum is correctly implemented.
    - Success: All protected routes wrapped in `auth:sanctum` middleware.
    - Success: `LeagueController` rigorously scopes all queries to the authenticated user.
    - Success: Seasons are correctly nested under leagues in `SeasonController.php`.
    - Success: `GameController` includes strict validation for scheduling: prevents self-play, no duplicate matchups, and date conflict detection.
    - Success: Player stats submission restricted to games with a 'done' status.
- **Panel C Findings**: 
    - Success: Standings are correctly calculated and sorted by wins.
    - Success: Leaderboard correctly aggregates top 10 players.
    - Success: Ex 1 fully implemented in `StandingsController::summary`.
    - Success: Ex 2 fully implemented in `GameController::store`.
    - Success: Ex 3 fully implemented in `TeamController::playerProfile`.
- **Bonus Justification**: +5 points awarded for superior code architecture and efficiency, specifically the effective use of eager loading (`with`) to prevent N+1 query problems.
- **Final Grade**: **125 / 120**
- **Feedback**: Exceptional work. Your implementation is clean, and the use of eager loading shows a strong understanding of performance optimization.
