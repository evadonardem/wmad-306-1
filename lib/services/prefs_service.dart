import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  static const _keyFavoriteImages = 'favorite_images_v2';

  /// Loads list of {imageUrl, breedName} maps.
  Future<List<Map<String, String>>> loadFavoriteImages() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getStringList(_keyFavoriteImages) ?? [];
    final favorites = <Map<String, String>>[];

    for (final item in raw) {
      try {
        final decoded = jsonDecode(item);
        if (decoded is! Map) continue;

        final imageUrl = decoded['imageUrl'];
        final breedName = decoded['breedName'];

        if (imageUrl is! String || imageUrl.isEmpty) continue;
        if (breedName is! String || breedName.isEmpty) continue;

        favorites.add({
          'imageUrl': imageUrl,
          'breedName': breedName,
        });
      } catch (_) {
        // Skip malformed saved entries instead of crashing on startup.
      }
    }

    return favorites;
  }

  /// Saves list of {imageUrl, breedName} maps.
  Future<void> saveFavoriteImages(
      List<Map<String, String>> favorites) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = favorites.map((e) => jsonEncode(e)).toList();
    await prefs.setStringList(_keyFavoriteImages, raw);
  }

  Future<void> clearFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyFavoriteImages);
  }
}
