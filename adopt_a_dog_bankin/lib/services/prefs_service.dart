import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  // Changed key name to plural for clarity
  static const _keyFavorites = 'favorite_breeds';

  // Load the list of saved favorite breeds
  Future<List<String>> loadFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    // Return the list if it exists, otherwise return an empty list []
    return prefs.getStringList(_keyFavorites) ?? [];
  }

  // Add a new favorite breed to the list
  Future<void> addFavorite(String breed) async {
    final prefs = await SharedPreferences.getInstance();
    List<String> favorites = prefs.getStringList(_keyFavorites) ?? [];
    
    // Only add it if it's not already in the list to prevent duplicates
    if (!favorites.contains(breed)) {
      favorites.add(breed);
      await prefs.setStringList(_keyFavorites, favorites);
    }
  }

  // Remove a specific breed from the list
  Future<void> removeFavorite(String breed) async {
    final prefs = await SharedPreferences.getInstance();
    List<String> favorites = prefs.getStringList(_keyFavorites) ?? [];
    favorites.remove(breed);
    await prefs.setStringList(_keyFavorites, favorites);
  }

  // Clear ALL favorites (useful for a reset button)
  Future<void> clearAllFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyFavorites);
  }
}