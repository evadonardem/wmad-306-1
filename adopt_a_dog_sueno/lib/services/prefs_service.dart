import 'dart:convert';
import 'dart:typed_data';
import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  static String _imageKey(String breedName) => 'favorite_image_$breedName';

  Future<void> saveFavoriteWithImage(
      String breedName, Uint8List imageBytes) async {
    await addFavorite(breedName);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_imageKey(breedName), base64Encode(imageBytes));
  }

  Future<Uint8List?> getFavoriteImageBytes(String breedName) async {
    final prefs = await SharedPreferences.getInstance();
    final encoded = prefs.getString(_imageKey(breedName));
    if (encoded == null) return null;
    return base64Decode(encoded);
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
