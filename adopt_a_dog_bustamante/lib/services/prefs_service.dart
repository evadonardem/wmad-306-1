import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  static const _keyFavorites = 'favorite_breeds';
  static const _keyFavoritesOld = 'favorite_breed'; // Old single-favorite key
  static const _maxFavorites = 100; // Increased limit to allow many favorites
  static const _keySearchTerm = 'last_search_term';

  /// Migrate old single favorite to new multiple favorites system
  Future<void> _migrateOldData() async {
    final prefs = await SharedPreferences.getInstance();
    
    // Check if old single-favorite data exists
    final oldFavorite = prefs.getString(_keyFavoritesOld);
    if (oldFavorite != null && oldFavorite.isNotEmpty) {
      // Migrate to new format
      final favorites = prefs.getStringList(_keyFavorites) ?? [];
      if (!favorites.contains(oldFavorite)) {
        favorites.add(oldFavorite);
        await prefs.setStringList(_keyFavorites, favorites);
      }
      // Optionally remove old key (optional)
      // await prefs.remove(_keyFavoritesOld);
    }
  }

  /// Save a breed to favorites (adds to list if not already there)
  Future<void> saveFavorite(String breedName) async {
    await _migrateOldData();
    final prefs = await SharedPreferences.getInstance();
    final favorites = prefs.getStringList(_keyFavorites) ?? [];
    
    if (!favorites.contains(breedName)) {
      // Prevent exceeding max favorites
      if (favorites.length < _maxFavorites) {
        favorites.add(breedName);
        await prefs.setStringList(_keyFavorites, favorites);
      }
    }
  }

  /// Load all favorite breeds
  Future<List<String>> loadFavorites() async {
    await _migrateOldData();
    final prefs = await SharedPreferences.getInstance();
    final favorites = prefs.getStringList(_keyFavorites) ?? [];
    // Sort alphabetically
    favorites.sort();
    return favorites;
  }

  /// Remove a specific breed from favorites
  Future<void> removeFavorite(String breedName) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = prefs.getStringList(_keyFavorites) ?? [];
    favorites.removeWhere((b) => b == breedName);
    await prefs.setStringList(_keyFavorites, favorites);
  }

  /// Check if a breed is favorited
  Future<bool> isFavorited(String breedName) async {
    await _migrateOldData();
    final prefs = await SharedPreferences.getInstance();
    final favorites = prefs.getStringList(_keyFavorites) ?? [];
    return favorites.contains(breedName);
  }

  /// Clear all favorites
  Future<void> clearAllFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyFavorites);
  }

  /// Save the last search term
  Future<void> saveSearchTerm(String searchTerm) async {
    final prefs = await SharedPreferences.getInstance();
    if (searchTerm.isEmpty) {
      await prefs.remove(_keySearchTerm);
    } else {
      await prefs.setString(_keySearchTerm, searchTerm);
    }
  }

  /// Load the last search term
  Future<String> loadSearchTerm() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keySearchTerm) ?? '';
  }
}
