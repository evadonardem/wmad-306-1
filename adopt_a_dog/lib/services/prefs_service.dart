import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  static const _keyFavorites = 'favorite_breeds';
  static const _keySearchTerm = 'last_search_term';

  /// Saves [breedName] to the list of favorites.
  Future<void> saveFavorite(String breedName) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = prefs.getStringList(_keyFavorites) ?? [];
    if (!favorites.contains(breedName)) {
      favorites.add(breedName);
      await prefs.setStringList(_keyFavorites, favorites);
    }
  }

  /// Returns the list of saved favorites.
  Future<List<String>> loadFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(_keyFavorites) ?? [];
  }

  /// Removes [breedName] from favorites.
  Future<void> removeFavorite(String breedName) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = prefs.getStringList(_keyFavorites) ?? [];
    favorites.remove(breedName);
    await prefs.setStringList(_keyFavorites, favorites);
  }

  /// Saves the last search term.
  Future<void> saveSearchTerm(String term) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keySearchTerm, term);
  }

  /// Returns the last saved search term, or null if none has been set.
  Future<String?> loadSearchTerm() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keySearchTerm);
  }
}