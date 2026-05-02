import 'dart:math';
import 'package:dio/dio.dart';
import '../models/hero_model.dart';

class SuperheroApiService {
  // ── Superhero API access token ──
  static const String _token = '0c3b400b3e27df185566cfc13a011fed';
  static const String _baseUrl = 'https://superheroapi.com/api/$_token';

  // ── Akabab CDN for reliable hero images (superherodb.com returns 403) ──
  static const String _imgCdn =
      'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api';

  final Dio _dio = Dio(BaseOptions(
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
  ));

  /// Cached mapping of hero ID → CDN image URL.
  static Map<int, String>? _imageMap;

  /// Load the image map from the akabab CDN (once, then cached).
  Future<void> _ensureImageMap() async {
    if (_imageMap != null) return;
    try {
      final response = await _dio.get('$_imgCdn/all.json');
      final list = response.data as List;
      _imageMap = {};
      for (final hero in list) {
        final id = hero['id'] as int;
        final images = hero['images'] as Map<String, dynamic>?;
        if (images != null) {
          _imageMap![id] = (images['md'] ?? images['sm'] ?? '').toString();
        }
      }
    } catch (_) {
      _imageMap = {};
    }
  }

  /// Resolve a working image URL for the given hero ID.
  String _resolveImageUrl(int id, String originalUrl) {
    if (_imageMap != null && _imageMap!.containsKey(id)) {
      return _imageMap![id]!;
    }
    return originalUrl;
  }

  /// Fetch a single hero by numeric ID (1–731).
  Future<HeroModel> fetchHeroById(int id) async {
    await _ensureImageMap();
    final response = await _dio.get('$_baseUrl/$id');
    final data = response.data;
    if (data is Map<String, dynamic> && data['response'] != 'error') {
      final hero = HeroModel.fromJson(data);
      return hero.copyWith(imageUrl: _resolveImageUrl(hero.id, hero.imageUrl));
    }
    throw Exception('Hero not found (ID: $id)');
  }

  /// Search heroes by name.
  Future<List<HeroModel>> searchHeroes(String query) async {
    await _ensureImageMap();
    final response = await _dio.get('$_baseUrl/search/$query');
    final data = response.data;
    if (data is Map<String, dynamic> && data['response'] == 'success') {
      final results = data['results'] as List;
      return results.map((e) {
        final hero = HeroModel.fromJson(e as Map<String, dynamic>);
        return hero.copyWith(imageUrl: _resolveImageUrl(hero.id, hero.imageUrl));
      }).toList();
    }
    return [];
  }

  /// Fetch a batch of random heroes (e.g. for roster or AI opponent).
  Future<List<HeroModel>> fetchRandomHeroes({int count = 20}) async {
    final rng = Random();
    final ids = <int>{};
    while (ids.length < count) {
      ids.add(rng.nextInt(731) + 1); // API has IDs 1–731
    }
    return _fetchByIds(ids.toList());
  }

  /// Fetch a curated list of popular / well-known heroes.
  Future<List<HeroModel>> fetchFeaturedHeroes() async {
    const featuredIds = [
      69,  // Batman
      644, // Superman
      620, // Spider-Man
      346, // Iron Man
      659, // Thor
      720, // Wonder Woman
      149, // Captain America
      717, // Wolverine
      263, // Flash
      332, // Hulk
      106, // Black Panther
      213, // Deadpool
      38,  // Aquaman
      298, // Green Lantern
      226, // Doctor Strange
      655, // Thanos
      370, // Joker
      687, // Venom
      414, // Loki
      423, // Magneto
      529, // Phoenix
      638, // Storm
      195, // Cyclops
      275, // Gamora
    ];
    return _fetchByIds(featuredIds);
  }

  /// Fetch heroes by a specific list of IDs (public).
  Future<List<HeroModel>> fetchHeroesByIds(List<int> ids) => _fetchByIds(ids);

  Future<List<HeroModel>> _fetchByIds(List<int> ids) async {
    final futures = ids.map((id) async {
      try {
        return await fetchHeroById(id);
      } catch (_) {
        return null;
      }
    });
    final results = await Future.wait(futures);
    return results.whereType<HeroModel>().toList();
  }
}
