import 'package:dio/dio.dart';

import '../models/hero_model.dart';

const String kApiToken = String.fromEnvironment(
  'SUPERHERO_API_TOKEN',
  defaultValue: 'de69a80f0edad59d070c4a6cd3773241',
);

class SuperheroApiService {
  SuperheroApiService({required String apiToken})
    : _token = apiToken,
      _dio = Dio(
        BaseOptions(
          baseUrl: 'https://superheroapi.com/api/',
          connectTimeout: const Duration(seconds: 10),
          receiveTimeout: const Duration(seconds: 10),
        ),
      );

  final String _token;
  final Dio _dio;

  Future<HeroModel> fetchHero(int id) async {
    _ensureToken();
    final response = await _dio.get('$_token/$id');
    _throwForBadResponse(response);
    return HeroModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<List<HeroModel>> searchHeroes(String name) async {
    _ensureToken();
    final response = await _dio.get(
      '$_token/search/${Uri.encodeComponent(name)}',
    );
    _throwForBadResponse(response);

    final data = response.data as Map<String, dynamic>;
    final results = data['results'] as List<dynamic>? ?? [];
    return results
        .map((json) => HeroModel.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Future<List<HeroModel>> fetchRandomHeroes({int count = 20}) async {
    _ensureToken();
    final ids = List.generate(731, (index) => index + 1)..shuffle();
    final heroes = <HeroModel>[];

    for (final id in ids) {
      if (heroes.length >= count) break;
      try {
        heroes.add(await fetchHero(id));
      } catch (_) {
        // Some API records can be missing or temporarily unavailable.
        // Keep looking so one bad id does not collapse the whole roster.
      }
    }

    if (heroes.isEmpty) {
      throw StateError('Could not load heroes from the Superhero API.');
    }

    return heroes;
  }

  void _ensureToken() {
    if (_token.trim().isEmpty) {
      throw StateError(
        'Missing SUPERHERO_API_TOKEN. Run with --dart-define=SUPERHERO_API_TOKEN=your_token.',
      );
    }
  }

  void _throwForBadResponse(Response<dynamic> response) {
    if (response.statusCode == null ||
        response.statusCode! < 200 ||
        response.statusCode! >= 300) {
      throw DioException.badResponse(
        statusCode: response.statusCode ?? 500,
        requestOptions: response.requestOptions,
        response: response,
      );
    }

    final data = response.data;
    if (data is Map<String, dynamic> && data['response'] == 'error') {
      throw StateError(data['error'] as String? ?? 'Superhero API error');
    }
  }
}

const List<HeroModel> fallbackHeroes = [
  HeroModel(
    id: '70',
    name: 'Batman',
    imageUrl: 'https://www.superherodb.com/pictures2/portraits/10/100/639.jpg',
    publisher: 'DC Comics',
    alignment: 'good',
    fullName: 'Bruce Wayne',
    powerStats: PowerStats(
      intelligence: 100,
      strength: 26,
      speed: 27,
      durability: 50,
      power: 47,
      combat: 100,
    ),
  ),
  HeroModel(
    id: '644',
    name: 'Superman',
    imageUrl: 'https://www.superherodb.com/pictures2/portraits/10/100/791.jpg',
    publisher: 'DC Comics',
    alignment: 'good',
    fullName: 'Clark Kent',
    powerStats: PowerStats(
      intelligence: 94,
      strength: 100,
      speed: 100,
      durability: 100,
      power: 100,
      combat: 85,
    ),
  ),
  HeroModel(
    id: '149',
    name: 'Captain America',
    imageUrl: 'https://www.superherodb.com/pictures2/portraits/10/100/274.jpg',
    publisher: 'Marvel Comics',
    alignment: 'good',
    fullName: 'Steve Rogers',
    powerStats: PowerStats(
      intelligence: 69,
      strength: 19,
      speed: 38,
      durability: 55,
      power: 60,
      combat: 100,
    ),
  ),
  HeroModel(
    id: '346',
    name: 'Iron Man',
    imageUrl: 'https://www.superherodb.com/pictures2/portraits/10/100/85.jpg',
    publisher: 'Marvel Comics',
    alignment: 'good',
    fullName: 'Tony Stark',
    powerStats: PowerStats(
      intelligence: 100,
      strength: 85,
      speed: 58,
      durability: 85,
      power: 100,
      combat: 64,
    ),
  ),
  HeroModel(
    id: '720',
    name: 'Wonder Woman',
    imageUrl: 'https://www.superherodb.com/pictures2/portraits/10/100/807.jpg',
    publisher: 'DC Comics',
    alignment: 'good',
    fullName: 'Diana Prince',
    powerStats: PowerStats(
      intelligence: 88,
      strength: 100,
      speed: 79,
      durability: 100,
      power: 100,
      combat: 100,
    ),
  ),
  HeroModel(
    id: '620',
    name: 'Spider-Man',
    imageUrl: 'https://www.superherodb.com/pictures2/portraits/10/100/133.jpg',
    publisher: 'Marvel Comics',
    alignment: 'good',
    fullName: 'Peter Parker',
    powerStats: PowerStats(
      intelligence: 90,
      strength: 55,
      speed: 67,
      durability: 75,
      power: 74,
      combat: 85,
    ),
  ),
  HeroModel(
    id: '655',
    name: 'Thor',
    imageUrl: 'https://www.superherodb.com/pictures2/portraits/10/100/140.jpg',
    publisher: 'Marvel Comics',
    alignment: 'good',
    fullName: 'Thor Odinson',
    powerStats: PowerStats(
      intelligence: 69,
      strength: 100,
      speed: 83,
      durability: 100,
      power: 100,
      combat: 100,
    ),
  ),
  HeroModel(
    id: '332',
    name: 'Hulk',
    imageUrl: 'https://www.superherodb.com/pictures2/portraits/10/100/83.jpg',
    publisher: 'Marvel Comics',
    alignment: 'good',
    fullName: 'Bruce Banner',
    powerStats: PowerStats(
      intelligence: 88,
      strength: 100,
      speed: 63,
      durability: 100,
      power: 98,
      combat: 85,
    ),
  ),
];
