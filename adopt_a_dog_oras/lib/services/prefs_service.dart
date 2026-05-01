import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  static String _imageKey(String breedName) => 'favorite_image_$breedName';

  Future<void> saveFavoriteWithImage(String breedName, String imageUrl) async {
    await addFavorite(breedName);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_imageKey(breedName), imageUrl);
  }

  Future<String?> getFavoriteImageUrl(String breedName) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_imageKey(breedName));
  }

  Future<void> removeFavoriteImageUrl(String breedName) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_imageKey(breedName));
  }

  static const _keyFavorites = 'favorite_breeds';

  Future<void> addFavorite(String breedName) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = prefs.getStringList(_keyFavorites) ?? [];
    if (!favorites.contains(breedName)) {
      favorites.add(breedName);
      await prefs.setStringList(_keyFavorites, favorites);
    }
  }

  Future<void> removeFavorite(String breedName) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = prefs.getStringList(_keyFavorites) ?? [];
    favorites.remove(breedName);
    await prefs.setStringList(_keyFavorites, favorites);
  }

  Future<List<String>> loadFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(_keyFavorites) ?? [];
  }

  Future<void> clearFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyFavorites);
  }
}
