import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class PhotoFavorite {
  final String breed;
  final String imageUrl;
  final int addedAt;

  PhotoFavorite({
    required this.breed,
    required this.imageUrl,
    required this.addedAt,
  });

  Map<String, dynamic> toJson() => {
    'breed': breed,
    'imageUrl': imageUrl,
    'addedAt': addedAt,
  };

  factory PhotoFavorite.fromJson(Map<String, dynamic> json) => PhotoFavorite(
    breed: json['breed'] as String,
    imageUrl: json['imageUrl'] as String,
    addedAt: json['addedAt'] as int,
  );
}

class PrefsService {
  static const _keyFavorites = 'adopt_a_dog_favorites';
  static const _keyPhotoFavorites = 'adopt_a_dog_photo_favorites';
  static const _keyLastSearch = 'adopt_a_dog_last_search';

  // ─── Breed Favorites ──────────────────────────────────────────────────────

  Future<List<String>> loadFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_keyFavorites);
    if (raw == null) return [];
    try {
      return List<String>.from(jsonDecode(raw) as List);
    } catch {
      return [];
    }
  }

  Future<void> saveFavorite(String breedName) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await loadFavorites();
    if (!current.contains(breedName)) {
      await prefs.setString(_keyFavorites, jsonEncode([breedName, ...current]));
    }
  }

  Future<void> removeFavorite(String breedName) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await loadFavorites();
    await prefs.setString(
      _keyFavorites,
      jsonEncode(current.where((b) => b != breedName).toList()),
    );
  }

  Future<void> clearFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyFavorites);
  }

  // ─── Photo Favorites ─────────────────────────────────────────────────────

  Future<List<PhotoFavorite>> loadPhotoFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_keyPhotoFavorites);
    if (raw == null) return [];
    try {
      final list = jsonDecode(raw) as List;
      return list
          .map((item) => PhotoFavorite.fromJson(item as Map<String, dynamic>))
          .toList();
    } catch {
      return [];
    }
  }

  Future<void> savePhotoFavorite(String breed, String imageUrl) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await loadPhotoFavorites();
    if (current.any((p) => p.imageUrl == imageUrl)) return;
    
    final updated = [
      PhotoFavorite(breed: breed, imageUrl: imageUrl, addedAt: DateTime.now().millisecondsSinceEpoch),
      ...current,
    ];
    await prefs.setString(
      _keyPhotoFavorites,
      jsonEncode(updated.map((p) => p.toJson()).toList()),
    );
  }

  Future<void> removePhotoFavorite(String imageUrl) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await loadPhotoFavorites();
    await prefs.setString(
      _keyPhotoFavorites,
      jsonEncode(
        current
            .where((p) => p.imageUrl != imageUrl)
            .map((p) => p.toJson())
            .toList(),
      ),
    );
  }

  Future<bool> isPhotoFavorite(String imageUrl) async {
    final current = await loadPhotoFavorites();
    return current.any((p) => p.imageUrl == imageUrl);
  }

  // ─── Search ──────────────────────────────────────────────────────────────

  Future<void> saveLastSearch(String term) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyLastSearch, term);
  }

  Future<String> loadLastSearch() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyLastSearch) ?? '';
  }
}
