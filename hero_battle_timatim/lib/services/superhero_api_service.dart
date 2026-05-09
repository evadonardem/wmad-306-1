// Tokenless superhero data — akabab/superhero-api hosted on jsdelivr CDN.
// Endpoints under the base URL:
//   id/{1..731}.json   single hero
//   all.json           full array of heroes
//
// The dataset has no server-side search, so searchHeroes() filters
// the (cached) full list client-side.

import 'package:dio/dio.dart';

import '../models/hero_model.dart';

class SuperheroApiService {
  SuperheroApiService()
      : _dio = Dio(BaseOptions(
          baseUrl:
              'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/',
          connectTimeout: const Duration(seconds: 10),
          receiveTimeout: const Duration(seconds: 15),
        ));

  final Dio _dio;
  // In-memory cache of all heroes — avoids re-downloading the full dataset
  // for every search keystroke / random shuffle.
  List<HeroModel>? _allCache;

  /// Fetch a single hero by numeric ID (1–731).
  Future<HeroModel> fetchHero(int id) async {
    final response = await _dio.get('id/$id.json');
    return HeroModel.fromJson((response.data as Map).cast<String, dynamic>());
  }

  /// Fetch the full hero list (cached after first call).
  Future<List<HeroModel>> fetchAll() async {
    if (_allCache != null) return _allCache!;
    final response = await _dio.get('all.json');
    final list = (response.data as List)
        .map((e) => HeroModel.fromJson((e as Map).cast<String, dynamic>()))
        .toList();
    _allCache = list;
    return list;
  }

  /// Search heroes by name — case-insensitive substring against the cached list.
  Future<List<HeroModel>> searchHeroes(String name) async {
    final q = name.trim().toLowerCase();
    if (q.isEmpty) return const [];
    final all = await fetchAll();
    return all
        .where((h) =>
            h.name.toLowerCase().contains(q) ||
            h.fullName.toLowerCase().contains(q))
        .toList();
  }

  /// Fetch a random selection of heroes from the cached full list.
  Future<List<HeroModel>> fetchRandomHeroes({int count = 20}) async {
    final all = await fetchAll();
    final shuffled = [...all]..shuffle();
    return shuffled.take(count).toList();
  }
}
