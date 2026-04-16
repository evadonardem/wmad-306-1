import 'package:dio/dio.dart';
import 'package:hero_battle/models/hero_model.dart';

class SuperheroApiService {
  final String apiKey = 'e7151626cbc9cde6e15943b0b8a414fd';
  final String baseUrl = 'https://superheroapi.com/api';
  late Dio _dio;

  SuperheroApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
    ));
  }

  /// Fetch a hero by ID
  Future<HeroModel?> getHeroById(int id) async {
    try {
      final response = await _dio.get('/$apiKey/$id');
      if (response.statusCode == 200) {
        final data = response.data;
        if (data['response'] != 'error') {
          return HeroModel.fromJson(data);
        }
      }
      return null;
    } catch (e) {
      print('Error fetching hero: $e');
      return null;
    }
  }

  /// Search heroes by name
  Future<List<HeroModel>> searchHeroes(String name) async {
    try {
      final response = await _dio.get('/$apiKey/search/$name');
      if (response.statusCode == 200) {
        final data = response.data;
        if (data['response'] == 'success' && data['results'] is List) {
          return (data['results'] as List)
              .map((hero) => HeroModel.fromJson(hero))
              .toList();
        }
      }
      return [];
    } catch (e) {
      print('Error searching heroes: $e');
      return [];
    }
  }

  /// Get random heroes for battle
  Future<List<HeroModel>> getRandomHeroes({int count = 5}) async {
    final heroes = <HeroModel>[];
    final randomIds = _generateRandomIds(count);

    for (int id in randomIds) {
      final hero = await getHeroById(id);
      if (hero != null) {
        heroes.add(hero);
      }
    }

    return heroes;
  }

  /// Generate random superhero IDs (API has heroes with IDs from 1-731)
  List<int> _generateRandomIds(int count) {
    final ids = <int>{};
    while (ids.length < count) {
      ids.add((_generateRandomInt(1, 731)));
    }
    return ids.toList();
  }

  int _generateRandomInt(int min, int max) {
    return min + (((max - min + 1) * (DateTime.now().microsecond % 1000000)) ~/ 1000000);
  }
}
