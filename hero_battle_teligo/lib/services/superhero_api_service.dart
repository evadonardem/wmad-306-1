import 'package:dio/dio.dart';
import '../models/hero_model.dart';

class SuperheroApiService {
  SuperheroApiService({required String apiToken})
      : _token = apiToken,
        _dio = Dio(BaseOptions(
          baseUrl: 'https://superheroapi.com/api/',
          connectTimeout: const Duration(seconds: 30),
          receiveTimeout: const Duration(seconds: 30),
        ));

  final String _token;
  final Dio _dio;

  Future<HeroModel> fetchHero(int id) async {
    final response = await _dio.get('$_token/$id');
    return HeroModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<List<HeroModel>> searchHeroes(String name) async {
    final response = await _dio.get('$_token/search/$name');
    final results = response.data['results'] as List<dynamic>? ?? [];
    return results
        .map((e) => HeroModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// Fetch heroes one by one with a small fixed set of known good IDs
  /// Avoids timeout from firing 20 parallel requests at once
  Future<List<HeroModel>> fetchRandomHeroes({int count = 10}) async {
    // Use a fixed shuffled list of popular hero IDs for reliability
    final popularIds = [
      70, 149, 332, 644, 107, 213, 423, 556, 38, 89,
      195, 290, 316, 489, 510, 601, 655, 720, 14, 45,
      88, 131, 177, 234, 301, 378, 412, 467, 523, 589,
    ]..shuffle();

    final heroes = <HeroModel>[];
    final selectedIds = popularIds.take(count).toList();

    // Fetch in small parallel batches of 3 to avoid overloading
    for (int i = 0; i < selectedIds.length; i += 3) {
      final batch = selectedIds.skip(i).take(3).toList();
      try {
        final results = await Future.wait(
          batch.map((id) => fetchHero(id).catchError((_) => _nullHero())),
        );
        heroes.addAll(results.where((h) => h.id != '-1'));
      } catch (_) {
        // skip failed batch, continue
      }
    }

    return heroes;
  }

  // Sentinel for failed fetches
  HeroModel _nullHero() => const HeroModel(
    id: '-1', name: '', imageUrl: '', publisher: '',
    alignment: 'neutral', fullName: '',
    powerStats: PowerStats(
      intelligence: 50, strength: 50, speed: 50,
      durability: 50, power: 50, combat: 50,
    ),
  );
}