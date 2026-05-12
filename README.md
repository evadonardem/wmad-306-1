# Adopt-a-Dog 🐕

A beautiful Flutter web application that helps users discover and adopt their perfect dog companion. Browse through hundreds of dog breeds, view breed details, and save your favorites!

## Features

✨ **Key Features:**
- 🔍 **Browse Breeds** - Explore all available dog breeds from the Dog API
- 🎯 **Search Functionality** - Quickly find your favorite breed with search
- 💔 **Mark Favorites** - Save your favorite breed for quick access
- 📱 **Responsive Design** - Works perfectly on web, mobile, and tablet
- 🎨 **Beautiful UI** - Modern Material Design 3 interface
- 🖼️ **Dog Images** - View random dog images for each breed
- 📊 **Sub-breeds** - Discover variations within each breed

## Project Structure

```
lib/
├── main.dart                 # Application entry point
├── models/
│   └── breed.dart           # Breed data model
├── screens/
│   ├── breed_list_screen.dart      # Main breed list with search
│   ├── breed_detail_screen.dart    # Breed details and images
│   └── favorites_screen.dart       # Favorites management
└── services/
    ├── dog_api_service.dart        # Dog API integration
    └── prefs_service.dart          # Local preferences management

web/
├── index.html               # HTML entry point with SEO metadata
└── manifest.json           # PWA manifest configuration
```

## Getting Started

### Prerequisites
- Flutter SDK (3.11.1 or higher)
- A modern web browser

### Installation

1. **Clone the project:**
```bash
cd adopt_a_dog
```

2. **Get dependencies:**
```bash
flutter pub get
```

3. **Run the web app:**
```bash
flutter run -d chrome
```

Or run on any device:
```bash
flutter run
```

### Build for Web

To create an optimized production build:

```bash
flutter build web --release
```

The build output will be in `build/web/`

## Technologies Used

- **Flutter** - Cross-platform UI framework
- **Dart** - Programming language
- **Dog API** - https://dog.ceo/dog-api/ for breed data
- **Shared Preferences** - Local storage for favorites
- **HTTP** - API communication

## Dependencies

- `flutter` - Core framework
- `cupertino_icons` - iOS-style icons
- `http: ^1.6.0` - HTTP client
- `shared_preferences: ^2.5.4` - Persistent storage

## Features Explained

### 🔍 Breed Search
- Real-time search filtering on breed names
- Displays match count and helpful messages
- Smooth animations and transitions

### 💔 Favorites System
- Save your favorite breed to local storage
- Persists across app sessions
- Quick access from any screen
- Clear favorites anytime

### 🖼️ Breed Details
- Beautiful breed detail page with images
- View all sub-breed variations as chips
- One-click favorite toggle
- Detailed breed information

### 🌐 Web Optimization
- SEO-friendly metadata
- Progressive Web App (PWA) support
- Responsive design
- Works offline (Flutter web)

## Code Quality

✅ **Features Implemented:**
- Proper error handling with retry buttons
- Loading states with visual feedback
- User-friendly error messages
- Null safety throughout
- Clean architecture patterns
- Reusable components

## Usage Guide

1. **On Startup:**
   - App loads all available dog breeds
   - Breeds are sorted alphabetically
   - Ready for searching and browsing

2. **Finding a Breed:**
   - Type in the search box to filter breeds
   - Tap any breed to view details
   - See breed variations and images

3. **Managing Favorites:**
   - Tap the heart icon to add/remove favorites
   - Visit favorites screen to manage selections
   - Favorites persist when you close the app

## Performance Optimizations

- Lazy loading of images
- Efficient list rendering
- Smart caching with shared_preferences
- Minimal re-renders
- Optimized API calls

## Browser Support

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Future Enhancements

Potential features for expansion:
- [ ] Multiple favorites support
- [ ] Adoption tracking
- [ ] User profiles
- [ ] Breed comparisons
- [ ] Adoption centers integration
- [ ] Notifications for breed availability

## Troubleshooting

### App won't load
- Check internet connection
- Clear browser cache
- Try a different browser

### Images not showing
- Images are loaded from dog.ceo API
- Check your internet connectivity
- API might be temporarily unavailable

### Favorites not saving
- Enable local storage in browser settings
- Clear browser data and retry
- Try a different browser

## API Reference

Uses the free Dog API (https://dog.ceo/dog-api/)

**Endpoints used:**
- `GET /api/breeds/list/all` - Get all breeds

## License

This project is created for educational purposes.

## Author

Created with ❤️ for learning Flutter web development

---

**Made with Flutter 💙**
