import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:dio/dio.dart';
import '../models/hero_model.dart';

class SuperheroApiService {
  static const String _baseUrl = 'https://superheroapi.com/api/';
  static const String _akababByIdBase =
      'https://akabab.github.io/superhero-api/api/id';
  static const List<String> _webProxyBases = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
  ];
  final String _token;
  final Dio _dio;

  SuperheroApiService({required String apiToken})
      : _token = apiToken,
        _dio = Dio(BaseOptions(
          connectTimeout: const Duration(seconds: 10),
          receiveTimeout: const Duration(seconds: 10),
        ));

  bool get hasToken => _token.trim().isNotEmpty;

  Future<bool> testConnection() async {
    if (!hasToken) return false;
    try {
      await _getJson('70');
      return true;
    } catch (_) {
      return false;
    }
  }

  // Fetch a single hero by numeric ID (1-731)
  Future<HeroModel> fetchHero(int id) async {
    if (!hasToken) {
      throw Exception('Missing API token. Add it in Profile > API Configuration.');
    }
    try {
      final data = await _getJson('$id');
      // Most hero payloads already include image.url.
      // Only call /{id}/image when the primary payload has no image.
      if (_extractImageUrl(data).isEmpty) {
        var imageUrl = await _fetchHeroImageUrl(id.toString());
        imageUrl = imageUrl.isNotEmpty
            ? imageUrl
            : await _fetchAkababImageUrl(id.toString());
        if (imageUrl.isNotEmpty) {
          data['url'] = imageUrl;
        }
      }
      // Add the token to the data for image URL construction
      data['_token'] = _token;
      return HeroModel.fromJson(data);
    } on DioException catch (e) {
      final status = e.response?.statusCode;
      if (status == 401 || status == 403) {
        throw Exception('Failed to fetch hero: API token unauthorized (HTTP $status).');
      }
      throw Exception('Failed to fetch hero: ${e.message}');
    }
  }

  // Search heroes by name
  Future<List<HeroModel>> searchHeroes(String name) async {
    if (name.trim().isEmpty) return [];
    if (!hasToken) {
      throw Exception('Missing API token. Add it in Profile > API Configuration.');
    }
    try {
      final data = await _getJson('search/$name');
      final results = data['results'] as List<dynamic>? ?? [];
      final heroes = <HeroModel>[];

      for (final item in results) {
        final heroJson = Map<String, dynamic>.from(item as Map);
        final id = heroJson['id']?.toString() ?? '';
        if (id.isNotEmpty && _extractImageUrl(heroJson).isEmpty) {
          var imageUrl = await _fetchHeroImageUrl(id);
          imageUrl = imageUrl.isNotEmpty ? imageUrl : await _fetchAkababImageUrl(id);
          if (imageUrl.isNotEmpty) {
            heroJson['url'] = imageUrl;
          }
        }
        heroJson['_token'] = _token;
        heroes.add(HeroModel.fromJson(heroJson));
      }

      return heroes;
    } on DioException catch (e) {
      final status = e.response?.statusCode;
      if (status == 401 || status == 403) {
        throw Exception('Failed to search heroes: API token unauthorized (HTTP $status).');
      }
      throw Exception('Failed to search heroes: ${e.message}');
    }
  }

  // Fetch a random selection of heroes
  Future<List<HeroModel>> fetchRandomHeroes({int count = 20}) async {
    if (!hasToken) {
      throw Exception('Missing API token. Add it in Profile > API Configuration.');
    }

    final ids = List.generate(731, (i) => i + 1)..shuffle();
    final heroes = <HeroModel>[];
    final maxAttempts = ids.length < count * 6 ? ids.length : count * 6;

    // Avoid firing too many parallel requests (especially through web proxies).
    for (var i = 0; i < maxAttempts; i++) {
      if (heroes.length >= count) break;
      try {
        heroes.add(await fetchHero(ids[i]));
      } catch (_) {
        // Skip failures and keep collecting until we reach count.
      }
    }

    if (heroes.isEmpty) {
      throw Exception('Unable to load heroes from Superhero API. Check token or API availability.');
    }

    return heroes;
  }

  Future<Map<String, dynamic>> _getJson(String path) async {
    if (!hasToken) {
      throw Exception('Missing API token. Add it in Profile > API Configuration.');
    }

    final target = '$_baseUrl$_token/$path';
    if (!kIsWeb) {
      return _decodeJsonFromResponse(await _dio.get(target));
    }

    Object? lastError;
    for (final proxy in _webProxyBases) {
      final requestUrl = '$proxy${Uri.encodeComponent(target)}';
      for (var attempt = 0; attempt < 2; attempt++) {
        try {
          return _decodeJsonFromResponse(await _dio.get(requestUrl));
        } catch (e) {
          lastError = e;
        }
      }
    }

    throw Exception('Web API request failed after proxy retries: $lastError');
  }

  Map<String, dynamic> _decodeJsonFromResponse(Response response) {
    final data = response.data;

    if (data is Map<String, dynamic>) {
      _throwIfApiError(data);
      return data;
    }
    if (data is String) {
      final decoded = jsonDecode(data);
      if (decoded is Map<String, dynamic>) {
        _throwIfApiError(decoded);
        return decoded;
      }
    }

    throw Exception('Unexpected API response format');
  }

  void _throwIfApiError(Map<String, dynamic> data) {
    if ((data['response'] as String?)?.toLowerCase() == 'error') {
      throw Exception(data['error'] ?? 'API error');
    }
  }

  Future<String> _fetchHeroImageUrl(String heroId) async {
    try {
      final imageData = await _getJson('$heroId/image');
      return imageData['url'] as String? ?? '';
    } catch (_) {
      return '';
    }
  }

  Future<String> _fetchAkababImageUrl(String heroId) async {
    try {
      final response = await _dio.get('$_akababByIdBase/$heroId.json');
      final data = response.data;

      Map<String, dynamic>? json;
      if (data is Map<String, dynamic>) {
        json = data;
      } else if (data is String) {
        final decoded = jsonDecode(data);
        if (decoded is Map<String, dynamic>) {
          json = decoded;
        }
      }

      if (json == null) return '';

      final images = json['images'];
      if (images is Map) {
        return images['md'] as String? ??
            images['sm'] as String? ??
            images['lg'] as String? ??
            images['xs'] as String? ??
            '';
      }
      return '';
    } catch (_) {
      return '';
    }
  }

  String _extractImageUrl(Map<String, dynamic> data) {
    final nested = (data['image'] as Map?)?['url'] as String? ?? '';
    final topLevel = data['url'] as String? ?? '';
    return nested.isNotEmpty ? nested : topLevel;
  }
}