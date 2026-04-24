import 'dart:math';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

import '../models/hero_model.dart';

class SuperheroApiService {
  static const String _token = 'ecb7cd901a8b475aad98499d56eee46d';
  static const String _baseUrl = 'https://superheroapi.com/api/$_token';

  final Dio _dio;
  final Random _random;

  SuperheroApiService({Dio? dio, Random? random})
    : _dio =
          dio ??
          Dio(
            BaseOptions(
              connectTimeout: const Duration(seconds: 15),
              receiveTimeout: const Duration(seconds: 15),
            ),
          ),
      _random = random ?? Random();

  Future<List<HeroSummary>> searchHeroes(String query) async {
    final term = query.trim();
    if (term.isEmpty) return const <HeroSummary>[];

    final encodedTerm = Uri.encodeComponent(term);
    final data = await _getJson('/search/$encodedTerm');
    if (!_isSuccess(data)) {
      if ((data['error']?.toString() ?? '').contains(
        'character with given name',
      )) {
        return const <HeroSummary>[];
      }
      throw Exception(data['error']?.toString() ?? 'Search failed');
    }

    final results = (data['results'] as List<dynamic>? ?? const <dynamic>[])
        .whereType<Map<String, dynamic>>()
        .map(HeroSummary.fromJson)
        .toList();
    return results;
  }

  Future<HeroDetail> fetchHeroById(String heroId) async {
    final data = await _getJson('/$heroId');
    if (!_isSuccess(data)) {
      throw Exception(
        data['error']?.toString() ?? 'Failed to load hero #$heroId',
      );
    }
    return HeroDetail.fromFullJson(data);
  }

  Future<Map<String, String>> fetchPowerstats(String heroId) async {
    return _fetchGroup(heroId, 'powerstats');
  }

  Future<Map<String, String>> fetchBiography(String heroId) async {
    return _fetchGroup(heroId, 'biography');
  }

  Future<Map<String, String>> fetchAppearance(String heroId) async {
    return _fetchGroup(heroId, 'appearance');
  }

  Future<Map<String, String>> fetchWork(String heroId) async {
    return _fetchGroup(heroId, 'work');
  }

  Future<Map<String, String>> fetchConnections(String heroId) async {
    return _fetchGroup(heroId, 'connections');
  }

  Future<HeroDetail> fetchHeroDeepDive(String heroId) async {
    final basic = await fetchHeroById(heroId);
    final sections = await Future.wait(<Future<Map<String, String>>>[
      fetchPowerstats(heroId),
      fetchBiography(heroId),
      fetchAppearance(heroId),
      fetchWork(heroId),
      fetchConnections(heroId),
    ]);

    return basic.copyWith(
      powerstats: sections[0],
      biography: sections[1],
      appearance: sections[2],
      work: sections[3],
      connections: sections[4],
    );
  }

  Future<HeroDetail> fetchRandomHero() async {
    const minId = 1;
    const maxId = 731;
    for (var i = 0; i < 12; i++) {
      final id = (minId + _random.nextInt(maxId)).toString();
      try {
        return await fetchHeroDeepDive(id);
      } catch (_) {
        // Continue until a valid hero payload is found.
      }
    }
    throw Exception('Could not find a random hero right now.');
  }

  Future<Map<String, String>> _fetchGroup(String heroId, String group) async {
    final data = await _getJson('/$heroId/$group');
    if (!_isSuccess(data)) {
      throw Exception(data['error']?.toString() ?? 'Failed to load $group');
    }
    const metaKeys = <String>{'response', 'id', 'name'};
    return data.entries
        .where((entry) => !metaKeys.contains(entry.key.toLowerCase()))
        .fold<Map<String, String>>(<String, String>{}, (map, entry) {
      map[entry.key] = _toText(entry.value);
      return map;
    });
  }

  Future<Map<String, dynamic>> _getJson(String path) async {
    try {
      final response = await _dio.getUri(_buildRequestUri(path));
      return _asMap(response.data);
    } on DioException catch (e) {
      if (kIsWeb) {
        throw Exception(
          'Web request blocked by network/CORS. Please retry in a few seconds.',
        );
      }
      throw Exception(e.message ?? 'Network request failed');
    }
  }

  Uri _buildRequestUri(String path) {
    final apiUrl = '$_baseUrl$path';
    if (!kIsWeb) return Uri.parse(apiUrl);

    // Superhero API blocks browser-origin calls directly. Use a CORS proxy on web.
    final encoded = Uri.encodeComponent(apiUrl);
    return Uri.parse('https://corsproxy.io/?$encoded');
  }

  bool _isSuccess(Map<String, dynamic> data) {
    return (data['response']?.toString().toLowerCase() ?? '') == 'success';
  }

  Map<String, dynamic> _asMap(dynamic data) {
    if (data is Map<String, dynamic>) return data;
    throw Exception('Invalid API response format');
  }

  String _toText(dynamic value) {
    if (value == null) return 'Unknown';
    if (value is List) {
      final items = value
          .where((item) => item != null && item.toString().trim().isNotEmpty)
          .map((item) => item.toString().trim())
          .toList();
      return items.isEmpty ? 'Unknown' : items.join(', ');
    }
    final text = value.toString().trim();
    if (text.isEmpty || text == 'null' || text == '-') {
      return 'Unknown';
    }
    return text;
  }
}
