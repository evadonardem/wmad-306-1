import 'dart:convert';

import 'package:adopt_a_dog/models/favorite_dog.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  static const _keyFavorites = 'favorite_breeds';
  static const _keySearchTerm = 'last_search_term';

  Future<bool> saveFavorite(FavoriteDog favoriteDog) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = await loadFavorites();

    final alreadySaved = favorites.any(
      (favorite) => favorite.imageUrl == favoriteDog.imageUrl,
    );

    if (alreadySaved) {
      return false;
    }

    favorites.add(favoriteDog);

    await prefs.setStringList(
      _keyFavorites,
      favorites.map((favorite) => jsonEncode(favorite.toJson())).toList(),
    );

    return true;
  }

  Future<List<FavoriteDog>> loadFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    final favoriteList = prefs.getStringList(_keyFavorites);

    if (favoriteList == null) {
      return [];
    }

    return favoriteList.map((favoriteJson) {
      final Map<String, dynamic> data = jsonDecode(favoriteJson);
      return FavoriteDog.fromJson(data);
    }).toList();
  }

  Future<bool> isFavoriteImage(String imageUrl) async {
    final favorites = await loadFavorites();
    return favorites.any((favorite) => favorite.imageUrl == imageUrl);
  }

  Future<void> removeFavoriteAt(int index) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = await loadFavorites();

    if (index < 0 || index >= favorites.length) {
      return;
    }

    favorites.removeAt(index);
    await prefs.setStringList(
      _keyFavorites,
      favorites.map((favorite) => jsonEncode(favorite.toJson())).toList(),
    );
  }

  Future<void> saveSearchTerm(String searchTerm) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keySearchTerm, searchTerm);
  }

  Future<String> loadSearchTerm() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keySearchTerm) ?? '';
  }
}
