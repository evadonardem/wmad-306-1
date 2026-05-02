# Hero Battle — Setup & Run Guide

## Prerequisites
- Flutter SDK 3.x (includes Dart 3)
- Android Studio or VS Code with Flutter + Dart extensions
- Android Emulator (API 21+) or iOS Simulator or a physical device
- Internet connection (fetches hero images at runtime)

---

## Step 1 — Copy the project into VS Code

Copy the entire `hero_battle/` folder into your local workspace.

Open the folder in VS Code:
```
File > Open Folder > hero_battle
```

---

## Step 2 — Install dependencies

Open the VS Code terminal (`` Ctrl+` ``) and run:

```bash
flutter pub get
```

---

## Step 3 — Run the app

Make sure your emulator or device is running, then:

```bash
flutter run
```

Or press **F5** in VS Code to run in debug mode.

---

## API Token

Your Superhero API token is already in `lib/constants.dart`:

```dart
const String kApiToken = 'd7faa3950b6d15a59b9138b3f807597a';
```

---

## Project Structure

```
lib/
  main.dart                    ← App entry, MultiProvider, MaterialApp
  constants.dart               ← API token
  router/
    app_router.dart            ← Named routes
  models/
    hero_model.dart            ← HeroModel + PowerStats
    battle_record.dart         ← Battle result model
    player_stats.dart          ← Player profile model
  services/
    superhero_api_service.dart ← Dio HTTP calls
    prefs_service.dart         ← SharedPreferences wrapper
    database_service.dart      ← SQLite helper (singleton)
  providers/
    deck_provider.dart         ← ChangeNotifier — deck state
    battle_provider.dart       ← ChangeNotifier — live battle state
    player_provider.dart       ← ChangeNotifier — profile + prefs
    hero_search_provider.dart  ← ChangeNotifier — search results
  engine/
    battle_engine.dart         ← Pure Dart combat logic
  screens/
    splash/     splash_screen.dart
    home/       home_screen.dart
    hero_detail/ hero_detail_screen.dart
    deck_builder/ deck_builder_screen.dart
    battle/     battle_screen.dart
    history/    history_screen.dart
    profile/    profile_screen.dart
  widgets/
    hero_card.dart
    hp_bar.dart
    stat_row.dart
```

---

## Features Implemented

| Feature | Status |
|---|---|
| Splash screen (loads prefs) | Done |
| Home screen (random heroes grid, FutureBuilder) | Done |
| Search heroes by name | Done |
| Hero Detail screen (stats + Add to Deck) | Done |
| Deck Builder (max 5 heroes, save to SQLite) | Done |
| Battle screen (turn-based, BattleProvider) | Done |
| Battle History (reads from SQLite) | Done |
| Player Profile (name + dark/light theme) | Done |
| SharedPreferences (name, theme) | Done |
| SQLite (deck save, battle history) | Done |
| Provider state management | Done |
| Named routes (AppRouter) | Done |
| FutureBuilder (loading/error/data) | Done |

---

## Troubleshooting

**App crashes at launch** → Run `flutter pub get` again, then `flutter clean && flutter run`

**Heroes not loading** → Check internet connection. The API token is already configured.

**Build errors** → Make sure your Flutter SDK is 3.x: `flutter --version`
