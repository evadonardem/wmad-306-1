import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  static const _keyFavorite = 'favorite_breed';

  Future<String?> loadFavorite() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyFavorite);
  }

  Future<void> clearFavorite() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyFavorite);
  }
}
