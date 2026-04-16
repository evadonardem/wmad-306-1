# Hero Battle Implementation Plan (Superhero API)

## Product Goal
Build a polished Flutter app that lets users:
- Search superheroes by name.
- View rich hero details (power stats, biography, appearance, work, connections, image).
- Filter and sort hero results.
- Build a deck and run hero battles.
- Persist user preferences and battle history locally.

This plan is tailored to the current project state where most model/provider/service files are placeholders.

## API Base and Auth
- Base URL pattern: `https://superheroapi.com/api/<token>/`
- Your token: use only in local/runtime config, not hardcoded in source.

### Endpoints to Use
1. Search heroes by name
   - `search/{name}`
2. Get hero details by id
   - `{id}`

Even though the API is simple, we will fully use detail fields from each hero payload.

## Security and Config Plan
1. Remove token from committed code.
2. Pass token via Dart define:
   - `--dart-define=SUPERHERO_API_TOKEN=...`
3. Read token with `const String.fromEnvironment('SUPERHERO_API_TOKEN')`.
4. Add fallback dev guidance to README only (no raw token committed).

## Architecture Plan

### 1) Data Layer
Files:
- `lib/models/hero_model.dart`
- `lib/services/superhero_api_service.dart`

Tasks:
1. Create a robust `HeroModel` with nested types or grouped fields:
   - `id`, `name`, `imageUrl`
   - `powerstats` (int values with safe parser)
   - `biography` (full-name, alignment, aliases, publisher, first appearance)
   - `appearance` (gender, race, height, weight, eye/hair color)
   - `work` (occupation, base)
   - `connections` (group affiliation, relatives)
2. Add safe parsing helpers for API irregularities:
   - convert `null`, `-`, `unknown` to sensible defaults.
   - numeric parsing for stats from string values.
3. Implement `SuperheroApiService` using Dio:
   - `Future<List<HeroModel>> searchHeroes(String query)`
   - `Future<HeroModel> getHeroById(String id)`
4. Add API error model with user-friendly messages (network, timeout, empty search, invalid response).

Acceptance checks:
- Searching "batman" returns populated hero cards.
- Opening a hero detail always shows safe defaults, never crashes on missing fields.

### 2) State Management Layer
Files:
- `lib/providers/hero_search_provider.dart`
- `lib/providers/deck_provider.dart`
- `lib/providers/battle_provider.dart`
- `lib/providers/player_provider.dart`

Tasks:
1. `HeroSearchProvider`
   - state: `query`, `results`, `isLoading`, `error`, `selectedFilters`, `sortMode`
   - debounce search (300-500ms) to reduce API calls.
   - support clear/reset.
2. Filtering support in provider:
   - alignment (good, bad, neutral)
   - race
   - publisher
   - min power threshold (from averaged powerstats)
3. Sorting support:
   - name A-Z
   - power high-low
   - intelligence high-low
4. `DeckProvider`
   - add/remove heroes
   - enforce deck limit (for example 5)
   - duplicate prevention
5. `BattleProvider`
   - run simulated battle using `BattleEngine`
   - expose winner, turn log, and loading state
6. `PlayerProvider`
   - keep theme and player profile
   - optional save methods for name/theme toggles

Acceptance checks:
- Typing in search updates results without stutter.
- Filters and sorting recompute instantly on current list.
- Deck size and duplicate rules enforced.

### 3) Domain and Battle Logic
Files:
- `lib/engine/battle_engine.dart`
- `lib/models/battle_record.dart`
- `lib/models/player_stats.dart`

Tasks:
1. Define battle score formula based on API powerstats:
   - Suggested weighted score:
     - combat 0.25
     - strength 0.20
     - durability 0.20
     - speed 0.15
     - intelligence 0.10
     - power 0.10
2. Add tie-break logic:
   - higher intelligence, then speed, then random seed.
3. `BattleRecord` model:
   - hero ids, names, computed scores, winner id, timestamp
4. `PlayerStats` model:
   - total battles, wins, losses, win rate

Acceptance checks:
- Battle outputs are deterministic except final random tie-break.
- Battle history entries store enough info to render history cards.

### 4) Persistence Layer
Files:
- `lib/services/database_service.dart`
- `lib/services/prefs_service.dart`

Tasks:
1. Use `sqflite` for battle history:
   - table: `battle_history`
   - indexes on timestamp and winner id
2. CRUD methods:
   - insert battle record
   - fetch recent history
   - clear history
3. Extend `PrefsService` methods:
   - save/load player name
   - save/load theme mode
   - optional onboarding/search defaults

Acceptance checks:
- Relaunch app keeps theme and player profile.
- History remains available after restart.

### 5) UI and Navigation Layer
Files:
- `lib/screens/home/home_screen.dart`
- `lib/router/app_router.dart`
- `lib/widgets/hero_card.dart`
- `lib/widgets/stat_row.dart`
- `lib/widgets/hp_bar.dart`

Design direction:
- High contrast, modern "comic-tech" look.
- Strong typography hierarchy.
- Gradient surfaces with subtle texture.
- Animated card reveal and stat bars using `flutter_animate`.

Tasks:
1. Home screen sections:
   - top app bar with deck count and profile action
   - search input with debounce
   - chips/dropdowns for filter and sort
   - responsive hero grid/list
2. Hero card widget:
   - image, name, alignment badge, top 3 stats, add-to-deck button
3. Hero detail screen (new screen file)
   - tabs or sections: Overview, Stats, Biography, Appearance, Work, Connections
4. Route wiring in `AppRouter`:
   - replace placeholders for hero detail, deck builder, battle, history, profile
5. Empty/loading/error states with clear call-to-action text.

Acceptance checks:
- Works cleanly on mobile widths and larger desktop/web windows.
- No overflow issues with long names/aliases.
- Loading and error states are always visible and actionable.

### 6) App Bootstrap and DI
Files:
- `lib/main.dart`

Tasks:
1. Register all providers in `MultiProvider`:
   - `PlayerProvider`, `HeroSearchProvider`, `DeckProvider`, `BattleProvider`
2. Inject `SuperheroApiService` to provider(s) via constructor.
3. Keep splash init fast (remove long fake delay for production use).

Acceptance checks:
- App starts and navigates to Home quickly.
- No provider-not-found exceptions.

### 7) Testing Plan
1. Unit tests:
   - hero parsing from sample JSON
   - filter/sort logic in `HeroSearchProvider`
   - battle score computation and tie-break behavior
2. Widget tests:
   - hero card rendering with missing stats
   - home search state transitions (loading, error, empty, populated)
3. Service tests with mocked Dio:
   - success, timeout, invalid payload, no results

## Build Order (Execution Sequence)
1. Implement `HeroModel` and parsing utilities.
2. Implement `SuperheroApiService` and validate with a manual search call.
3. Implement `HeroSearchProvider` with debounce/filter/sort.
4. Build `HeroCard`, `StatRow`, `HpBar` and complete `HomeScreen`.
5. Add hero detail screen and route wiring.
6. Implement deck and battle providers plus `BattleEngine`.
7. Add database history and profile stats.
8. Final polish: animations, responsive pass, error UX, tests.

## Suggested Extra Features (Optional)
1. Search suggestions from recent queries.
2. Favorite heroes list persisted in local DB.
3. Compare two heroes side-by-side stat radar.
4. "Random Hero" quick action by random id.

## Done Definition
1. Search, filter, sort, and detail views are complete and stable.
2. Deck and battle flow functions end-to-end.
3. Theme/profile/history persist between sessions.
4. UI is responsive and visually polished on mobile and desktop.
5. Core parsing/provider logic covered by tests.