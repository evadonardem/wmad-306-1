import 'dart:math' as math;

import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import '../models/hero_model.dart';

class SuperheroApiService {
  static const int maxHeroId = 731;

  SuperheroApiService({required String apiToken, Dio? dio})
    : _token = apiToken.trim(),
      _dio =
          dio ??
          Dio(
            BaseOptions(
              baseUrl: 'https://superheroapi.com/api/',
              connectTimeout: const Duration(seconds: 10),
              receiveTimeout: const Duration(seconds: 10),
            ),
          );

  factory SuperheroApiService.fromRuntime({Dio? dio}) {
    final tokenFromEnv = dotenv.env['SUPERHERO_API_TOKEN']?.trim() ?? '';
    const tokenFromDefine = String.fromEnvironment('SUPERHERO_API_TOKEN');
    final token = tokenFromEnv.isNotEmpty
        ? tokenFromEnv
        : tokenFromDefine.trim();

    return SuperheroApiService(apiToken: token, dio: dio);
  }

  final String _token;
  final Dio _dio;
  final Map<int, String> _imageUrlCache = <int, String>{};

  Future<HeroModel> fetchHero(int id) async {
    _validateToken();
    if (id < 1 || id > maxHeroId) {
      throw const SuperheroApiException('Hero ID must be between 1 and 731.');
    }

    final response = await _dio.get<dynamic>('$_token/$id');
    final data = _asJsonMap(response.data);
    _ensureSuccess(data);

    var hero = HeroModel.fromJson(data);
    final resolvedImageUrl = await _resolveImageUrlForHero(id, hero.imageUrl);
    hero = hero.copyWith(imageUrl: resolvedImageUrl);

    return hero;
  }

  Future<String> fetchHeroImageUrl(int id) async {
    _validateToken();
    if (id < 1 || id > maxHeroId) {
      throw const SuperheroApiException('Hero ID must be between 1 and 731.');
    }

    final response = await _dio.get<dynamic>('$_token/$id/image');
    final data = _asJsonMap(response.data);
    _ensureSuccess(data);
    return _normalizeImageUrl(data['url']?.toString() ?? '');
  }

  Future<String> _resolveImageUrlForHero(int id, String rawUrl) async {
    final normalized = _normalizeImageUrl(rawUrl);

    // superherodb hotlink responses are frequently blocked (403) in-app,
    // so prefer a stable id-based image host when that domain is detected.
    if (_isBlockedImageHost(normalized)) {
      final stable = await _fetchStableImageUrlById(id);
      if (_isUsableImageUrl(stable)) {
        return stable;
      }
    }

    if (_isUsableImageUrl(normalized)) {
      return normalized;
    }

    try {
      final endpointImageUrl = await fetchHeroImageUrl(id);
      if (_isBlockedImageHost(endpointImageUrl)) {
        final stable = await _fetchStableImageUrlById(id);
        if (_isUsableImageUrl(stable)) {
          return stable;
        }
      }

      if (_isUsableImageUrl(endpointImageUrl)) {
        return endpointImageUrl;
      }
    } catch (_) {
      // Continue to stable id-based fallback.
    }

    final stable = await _fetchStableImageUrlById(id);
    if (_isUsableImageUrl(stable)) {
      return stable;
    }

    return normalized;
  }

  Future<String> _fetchStableImageUrlById(int id) async {
    final cached = _imageUrlCache[id];
    if (cached != null && cached.isNotEmpty) {
      return cached;
    }

    try {
      final response = await _dio.get<dynamic>(
        'https://akabab.github.io/superhero-api/api/id/$id.json',
      );
      final data = _asJsonMapOrEmpty(response.data);
      final images = _asJsonMapOrEmpty(data['images']);

      final stable = _normalizeImageUrl(
        images['md']?.toString() ??
            images['lg']?.toString() ??
            images['sm']?.toString() ??
            '',
      );

      if (stable.isNotEmpty) {
        _imageUrlCache[id] = stable;
      }

      return stable;
    } catch (_) {
      return '';
    }
  }

  Future<List<HeroModel>> searchHeroes(String name) async {
    _validateToken();
    final normalized = name.trim();
    if (normalized.isEmpty) return const [];

    final response = await _dio.get<dynamic>(
      '$_token/search/${Uri.encodeComponent(normalized)}',
    );

    final data = _asJsonMap(response.data);
    if (data['response'] != 'success') {
      final message = _apiErrorMessage(data);
      if (message.toLowerCase().contains('character with given name')) {
        return const [];
      }
      throw SuperheroApiException(message);
    }

    final results = data['results'] as List<dynamic>? ?? const <dynamic>[];
    final baseHeroes = results
        .whereType<Map>()
        .map((e) => HeroModel.fromJson(Map<String, dynamic>.from(e)))
        .toList();

    // Resolve each result through the ID endpoint so image URLs and fields
    // exactly match the canonical hero-by-id record.
    final hydrated = await Future.wait(
      baseHeroes.map((hero) async {
        final id = int.tryParse(hero.id);
        if (id == null) return hero;
        try {
          return await fetchHero(id);
        } catch (_) {
          return hero;
        }
      }),
    );

    return hydrated;
  }

  Future<List<HeroModel>> fetchRandomHeroes({int count = 20}) async {
    _validateToken();
    final safeCount = count.clamp(1, maxHeroId);
    final ids = List.generate(maxHeroId, (i) => i + 1)..shuffle();
    final futures = ids.take(safeCount).map(fetchHero);
    return Future.wait(futures);
  }

  Future<List<HeroModel>> fetchHeroesPage({
    required int startId,
    int count = 30,
  }) async {
    _validateToken();

    if (startId > maxHeroId) {
      return const <HeroModel>[];
    }

    final safeStart = math.max(1, startId);
    final safeCount = count.clamp(1, maxHeroId);
    final endId = math.min(maxHeroId, safeStart + safeCount - 1);

    final ids = <int>[for (var id = safeStart; id <= endId; id++) id];

    final heroes = await Future.wait(
      ids.map((id) async {
        try {
          return await fetchHero(id);
        } catch (_) {
          return null;
        }
      }),
    );

    return heroes.whereType<HeroModel>().toList();
  }

  // Compatibility method used by previous target code.
  Future<HeroModel> getHeroById(int id) {
    return fetchHero(id);
  }

  void _validateToken() {
    if (_token.isEmpty) {
      throw const SuperheroApiConfigException(
        'Missing SUPERHERO_API_TOKEN. Add it to .env or pass --dart-define=SUPERHERO_API_TOKEN=YOUR_TOKEN.',
      );
    }
  }

  Map<String, dynamic> _asJsonMap(dynamic data) {
    if (data is Map<String, dynamic>) {
      return data;
    }
    if (data is Map) {
      return Map<String, dynamic>.from(data);
    }
    throw const SuperheroApiException('Unexpected API response format.');
  }

  void _ensureSuccess(Map<String, dynamic> payload) {
    if (payload['response'] == 'success') {
      return;
    }
    throw SuperheroApiException(_apiErrorMessage(payload));
  }

  bool _isUsableImageUrl(String value) {
    final normalized = _normalizeImageUrl(value);
    if (normalized.isEmpty) return false;

    final uri = Uri.tryParse(normalized);
    if (uri == null || uri.host.isEmpty || !uri.hasScheme) {
      return false;
    }

    return uri.scheme == 'https' || uri.scheme == 'http';
  }

  bool _isBlockedImageHost(String value) {
    if (value.isEmpty) return false;

    final uri = Uri.tryParse(value);
    if (uri == null || uri.host.isEmpty) {
      return false;
    }

    final host = uri.host.toLowerCase();
    return host.contains('superherodb.com');
  }

  String _normalizeImageUrl(String value) {
    var normalized = value.trim();
    if (normalized.isEmpty) return '';

    normalized = normalized.replaceFirst(
      RegExp(r'^httpss://', caseSensitive: false),
      'https://',
    );
    normalized = normalized.replaceFirst(
      RegExp(r'^http://', caseSensitive: false),
      'https://',
    );

    return normalized;
  }

  String _apiErrorMessage(Map<String, dynamic> payload) {
    return payload['error']?.toString() ?? 'Unknown API error.';
  }

  Map<String, dynamic> _asJsonMapOrEmpty(dynamic data) {
    if (data is Map<String, dynamic>) {
      return data;
    }
    if (data is Map) {
      return Map<String, dynamic>.from(data);
    }
    return const <String, dynamic>{};
  }
}

class SuperheroApiException implements Exception {
  const SuperheroApiException(this.message);

  final String message;

  @override
  String toString() => message;
}

class SuperheroApiConfigException extends SuperheroApiException {
  const SuperheroApiConfigException(super.message);
}
