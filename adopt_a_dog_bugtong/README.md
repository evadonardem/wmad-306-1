# Adopt-a-Dog

Adopt-a-Dog is a Flutter app that helps users browse dog breeds, view photos, and save favorites.

## Core Features

- Loads all breeds from Dog CEO API.
- Search/filter breeds by name.
- Shows a "Dog of the Day" hero card with refresh.
- Opens breed detail with:
	- main photo
	- sub-breed selector (when available)
	- gallery of additional photos
- Saves favorite breeds.
- Saves favorite photos.
- Persists favorites and search term using local storage.

## API and Data Source

- API: https://dog.ceo/dog-api/
- Endpoints used:
	- `GET /api/breeds/list/all`
	- `GET /api/breed/{breed}/images/random`
	- `GET /api/breed/{breed}/images/random/{count}`

## Tech Stack

- Flutter (Material 3)
- Dart
- `http` for API calls
- `shared_preferences` for local persistence

## Project Structure

- `lib/main.dart`: App entry and theme.
- `lib/models/breed.dart`: Breed model.
- `lib/services/dog_api_service.dart`: API integration.
- `lib/services/prefs_service.dart`: Local persistence.
- `lib/screens/breed_list_screen.dart`: Home/search/list UI.
- `lib/screens/breed_detail_screen.dart`: Breed detail/photos/favorites.
- `lib/screens/favorites_screen.dart`: Saved breeds and photos.
- `lib/widgets/dog_network_image.dart`: Network image widget with web-safe fallback behavior.

## Run Instructions

1. Install Flutter SDK and verify:
	 - `flutter doctor`
2. Fetch dependencies:
	 - `flutter pub get`
3. Run app:
	 - Mobile: `flutter run`
	 - Web (Chrome): `flutter run -d chrome`

## Quality Checks

- Static analysis:
	- `flutter analyze`
- Tests:
	- `flutter test`

## Notes

- Web image loading is handled with a custom image widget that uses a fallback strategy suitable for cross-origin image hosts.
- If you update dependencies, re-run:
	- `flutter clean && flutter pub get`
