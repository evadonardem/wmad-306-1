import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  static const _favoritesKey = 'favorite_dogs';

  Future<void> addFavorite(String breed, String imageUrl) async {
    final prefs = await SharedPreferences.getInstance();
    final list = await getFavorites();

    // Avoid duplicates
    if (list.any((d) => d['breed'] == breed)) return;

    list.add({'breed': breed, 'image': imageUrl});
    await prefs.setString(_favoritesKey, jsonEncode(list));
  }

  Future<void> removeFavorite(String breed) async {
    final prefs = await SharedPreferences.getInstance();
    final list = await getFavorites();
    list.removeWhere((d) => d['breed'] == breed);
    await prefs.setString(_favoritesKey, jsonEncode(list));
  }

  Future<List<Map<String, String>>> getFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_favoritesKey);
    if (raw == null) return [];
    final decoded = jsonDecode(raw) as List;
    return decoded.map((e) => Map<String, String>.from(e)).toList();
  }

  Future<bool> isFavorite(String breed) async {
    final list = await getFavorites();
    return list.any((d) => d['breed'] == breed);
  }

  Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_favoritesKey);
  }
}