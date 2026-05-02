# Hero Battle

## Target 2 - Prerequisites

This section tracks compliance for Step 2 of the Hero Battle Student Development Manual.

### Required Tools

| Tool | Minimum Version | Notes |
| --- | --- | --- |
| Flutter SDK | 3.x | Includes Dart 3 |
| Dart SDK | 3.0+ | Bundled with Flutter |
| Android Studio or VS Code | Latest stable | Install Flutter and Dart plugins |
| Android Emulator or iOS Simulator | Android API 21+ / iOS 12+ | Physical device is allowed |
| Internet connection | Required | Needed to fetch hero images and API data |
| Superhero API token | Required | Free token from superheroapi.com |

### Verification Commands

Run these commands from the app folder:

1. `flutter --version`
2. `dart --version`
3. `flutter doctor -v`

### Current Verification Status (April 17, 2026)

- PASS: Flutter SDK 3.41.4
- PASS: Dart SDK 3.11.1
- PASS: Android device detected (TECNO CH7n, Android 12 / API 31)
- PASS: Network resources available
- ACTION NEEDED: Android cmdline-tools are missing
- ACTION NEEDED: Android licenses are not yet accepted

### Action Items To Complete Android Prerequisites

1. Install Android cmdline-tools from Android Studio SDK Manager, or from the Android command-line tools package.
2. Accept Android licenses:

	`flutter doctor --android-licenses`

3. Re-run verification:

	`flutter doctor -v`

### Superhero API Token Requirement

Get your free API token at superheroapi.com by logging in with Facebook, then run the app with:

`flutter run --dart-define=SUPERHERO_API_TOKEN=YOUR_TOKEN`

Do not commit real tokens to source control.

## Target 4 - The Superhero API

The project uses https://superheroapi.com as a free REST data source for hero stats, biography, and images.

### Endpoints Used

| Endpoint | Method | Description |
| --- | --- | --- |
| /api/{token}/{id} | GET | Full hero data by numeric ID (1-731) |
| /api/{token}/search/{name} | GET | Search heroes by name |

### API Token Setup

Store the API key in the app-level env file:

1. Copy .env.example to .env in the hero_battle folder.
2. Add this line:

	`SUPERHERO_API_TOKEN=5bb37241ea8d3286661462bc56296b8b`

The app now loads .env at startup and also supports fallback via --dart-define.

### Parser Note (Section 5.1 requirement)

Superhero API powerstats are strings and may contain the literal string null.

The current HeroModel.fromJson parser handles both cases by converting valid numeric strings to int and defaulting invalid or null-like values to 50.

## Target 6 - Key Concepts Deep-Dive

### 6.1 ChangeNotifier + Provider

| Concept | Class / Widget | When to use |
| --- | --- | --- |
| Define state | ChangeNotifier | Your state class extends it |
| Register provider | ChangeNotifierProvider | In MultiProvider at app root |
| Read + rebuild | Consumer<T> | Smallest subtree that must rebuild |
| Read + rebuild | context.watch<T>() | Inside build() as alternative to Consumer |
| Read without rebuild | context.read<T>() | Inside callbacks / initState |
| Notify listeners | notifyListeners() | After any state mutation in ChangeNotifier |

### 6.2 FutureBuilder - Three States

| State | Condition | What to show |
| --- | --- | --- |
| Pending | connectionState != ConnectionState.done | CircularProgressIndicator |
| Error | snapshot.hasError | Error message with retry button |
| Data | snapshot.hasData | Your content widget(s) |

### 6.3 SharedPreferences

- Always await SharedPreferences.getInstance(); it is asynchronous.
- Use typed getters/setters: getString, setString, getBool, setBool, setInt, getInt.
- Define all keys as private constants in PrefsService to avoid typos.
- Data persists across restarts but is deleted when the app is uninstalled.
- Do not store API tokens or passwords in SharedPreferences. Use flutter_secure_storage.

### 6.4 SQLite with sqflite

- Use a singleton DatabaseService so the database file is opened only once.
- Define your schema in the onCreate callback inside openDatabase.
- Store booleans as INTEGER (1 = true, 0 = false) since SQLite has no bool type.
- Store complex objects (for example, a list of heroes) as JSON text using jsonEncode / jsonDecode.

## Target 7 - Common Errors & Fixes

| Error / Symptom | Cause | Fix |
| --- | --- | --- |
| UI never updates after state change | Forgot to call notifyListeners() | Add notifyListeners() after every mutation in your ChangeNotifier |
| ProviderNotFoundException | Provider not registered above widget | Wrap in ChangeNotifierProvider in MultiProvider at app root |
| FutureBuilder loops / infinite requests | Future created inside build() | Move Future to initState() and store in a field |
| setState after dispose() | Async callback fires after leaving screen | Guard all async callbacks with if (mounted) |
| SQLite: no such table | Schema not created / version mismatch | Increment database version or call deleteDatabase() during dev |
| SharedPreferences returns null | Key not set yet or typo in key string | Define keys as constants; return a default with the ?? operator |
| Navigator: unknown route | Route name not in onGenerateRoute | Add the route to AppRouter.onGenerateRoute; check RouteNames constants |
| API powerstats are null | Hero has no data in the API | PowerStats.fromJson defaults null-like strings to 50 |
