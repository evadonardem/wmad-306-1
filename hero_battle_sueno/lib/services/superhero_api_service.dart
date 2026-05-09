import 'package:dio/dio.dart';
import 'dart:async';
import '../models/hero_model.dart';

class SuperheroApiService {
  final Dio _dio = Dio();
  List<HeroModel> _cachedHeroes = [];

  /// Fetch all heroes once and cache (cache ALL for search)
  Future<List<HeroModel>> fetchAllHeroes() async {
    try {
      if (_cachedHeroes.isNotEmpty) return _cachedHeroes;

      final response = await _dio
          .get('https://akabab.github.io/superhero-api/api/all.json')
          .timeout(const Duration(seconds: 7));

      if (response.statusCode != 200) {
        throw Exception('Failed to load heroes: ${response.statusCode}');
      }

      final List data = response.data;
      _cachedHeroes = data.map((e) => HeroModel.fromJson(e)).toList();
      return _cachedHeroes;
    } on TimeoutException {
      throw Exception('API timeout: The server took too long to respond.');
    } catch (e) {
      throw Exception('API error: $e');
    }
  }

  /// Manual search (case-insensitive, cached, by name or id, empty query returns all)
  Future<List<HeroModel>> searchHeroes(String query) async {
    try {
      final heroes = await fetchAllHeroes();
      final q = query.trim().toLowerCase();
      if (q.isEmpty) return heroes;
      return heroes.where((hero) {
        return hero.name.toLowerCase().contains(q) ||
            hero.id.toLowerCase().contains(q);
      }).toList();
    } catch (e) {
      throw Exception('API error: $e');
    }
  }
}
