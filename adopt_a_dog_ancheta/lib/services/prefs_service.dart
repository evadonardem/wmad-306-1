import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  static const String _keyFavorites = 'favorite_breeds';
  static const String _keySearchTerm = 'last_search_term';

  // Save multiple favorites
  Future<void> saveFavorite(String breedName) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = await loadFavorites();
    if (!favorites.contains(breedName)) {
      favorites.add(breedName);
      await prefs.setStringList(_keyFavorites, favorites);
    }
  }

  // Remove favorite
  Future<void> removeFavorite(String breedName) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = await loadFavorites();
    favorites.remove(breedName);
    await prefs.setStringList(_keyFavorites, favorites);
  }

  // Load all favorites
  Future<List<String>> loadFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(_keyFavorites) ?? [];
  }

  // Check if breed is favorite
  Future<bool> isFavorite(String breedName) async {
    final favorites = await loadFavorites();
    return favorites.contains(breedName);
  }

  // Save search term
  Future<void> saveSearchTerm(String term) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keySearchTerm, term);
  }

  // Load search term
  Future<String> loadSearchTerm() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keySearchTerm) ?? '';
  }
}