import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  static const _keyFavorites = 'favorites'; // List of favorite breeds

  /// Get SharedPreferences instance
  Future<SharedPreferences> getInstance() async {
    return SharedPreferences.getInstance();
  }

  /// Get all saved favorites
  Future<List<String>> getFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(_keyFavorites) ?? [];
  }

  /// Add a breed to favorites (no duplicates)
  Future<void> addFavorite(String breed) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = prefs.getStringList(_keyFavorites) ?? [];

    if (!favorites.contains(breed)) {
      favorites.add(breed);
      await prefs.setStringList(_keyFavorites, favorites);
    }
  }

  /// Remove a breed from favorites
  Future<void> removeFavorite(String breed) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = prefs.getStringList(_keyFavorites) ?? [];

    favorites.removeWhere((item) => item == breed);
    await prefs.setStringList(_keyFavorites, favorites);
  }

  /// Check if a breed is in favorites
  Future<bool> isFavorite(String breed) async {
    final favorites = await getFavorites();
    return favorites.contains(breed);
  }

  /// Clear all favorites
  Future<void> clearAllFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyFavorites);
  }

  /// Legacy method for backward compatibility - loads first favorite if exists
  Future<String?> loadFavorite() async {
    final favorites = await getFavorites();
    return favorites.isNotEmpty ? favorites.first : null;
  }

  /// Legacy method for backward compatibility - saves to list
  Future<void> saveFavorite(String breed) async {
    await addFavorite(breed);
  }

  /// Legacy method for backward compatibility - clears all
  Future<void> clearFavorite() async {
    await clearAllFavorites();
  }
}
