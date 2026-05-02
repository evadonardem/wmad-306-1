# Adopt A Dog

Adopt A Dog is a Flutter app that lets users browse dog breeds, view random photos, and save one favorite breed locally.

## Features

- Browse available dog breeds from Dog CEO API
- Search breeds by name
- Open breed details with a responsive, non-cropped image view
- Tap Next to load another photo and a refreshed dog profile
- See an image name overlay (Meet <name>)
- Save and clear a favorite breed using local storage

## Tech Stack

- Flutter (Material 3)
- http
- shared_preferences

## Project Structure

- lib/main.dart: App entry point and theme
- lib/models/breed.dart: Breed model
- lib/services/dog_api_service.dart: API integration
- lib/services/prefs_service.dart: Local persistence for favorite breed
- lib/screens/breed_list_screen.dart: Breed list and search
- lib/screens/breed_detail_screen.dart: Breed image/profile detail screen
- lib/screens/favorites_screen.dart: Favorite breed screen

## Getting Started

### Prerequisites

- Flutter SDK installed
- A device/emulator connected

### Run

1. Install dependencies:

	 flutter pub get

2. Start the app:

	 flutter run

## Testing and Analysis

- Run tests:

	flutter test

- Run static analysis:

	flutter analyze

## Notes

- The app uses the public Dog CEO API: https://dog.ceo/dog-api/
- Internet access is required to load breed images.
