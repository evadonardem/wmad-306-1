import 'dart:convert';

import 'package:http/http.dart' as http;

import 'models.dart';

class HeroApi {
  static const String _token = 'd7faa3950b6d15a59b9138b3f807597a';
  static const String _base = 'https://superheroapi.com/api/$_token';

  static int _parseStat(dynamic value) {
    if (value == null) return 50;
    final s = value.toString();
    if (s == 'null' || s.isEmpty) return 50;
    return int.tryParse(s) ?? 50;
  }

  static HeroModel _parseHero(Map<String, dynamic> json) {
    final ps = (json['powerstats'] as Map<String, dynamic>? ?? const {});
    final bio = (json['biography'] as Map<String, dynamic>? ?? const {});
    final img = (json['image'] as Map<String, dynamic>? ?? const {});
    final id = '${json['id'] ?? ''}';
    final name = '${json['name'] ?? 'Unknown'}';
    final imageUrl = normalizeHeroImageUrl(
      id: id,
      name: name,
      imageUrl: '${img['url'] ?? ''}',
    );
    return HeroModel(
      id: id,
      name: name,
      imageUrl: imageUrl,
      publisher: '${bio['publisher'] ?? ''}',
      alignment: '${bio['alignment'] ?? 'neutral'}',
      fullName: '${bio['full-name'] ?? ''}',
      powerStats: PowerStats(
        intelligence: _parseStat(ps['intelligence']),
        strength: _parseStat(ps['strength']),
        speed: _parseStat(ps['speed']),
        durability: _parseStat(ps['durability']),
        power: _parseStat(ps['power']),
        combat: _parseStat(ps['combat']),
      ),
    );
  }

  static Future<HeroModel> fetchHero(int id) async {
    final uri = Uri.parse('$_base/$id');
    final response = await http.get(uri);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Failed to fetch hero $id');
    }
    final data = jsonDecode(response.body) as Map<String, dynamic>;
    if (data['response'] == 'error') {
      throw Exception('${data['error']}');
    }
    return _parseHero(data);
  }

  static Future<List<HeroModel>> searchHeroes(String name) async {
    final uri = Uri.parse('$_base/search/${Uri.encodeComponent(name)}');
    final response = await http.get(uri);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Search failed');
    }
    final data = jsonDecode(response.body) as Map<String, dynamic>;
    if (data['response'] == 'error') {
      return const [];
    }
    final results = (data['results'] as List<dynamic>? ?? const []);
    return results
        .whereType<Map<String, dynamic>>()
        .map(_parseHero)
        .toList(growable: false);
  }

  static Future<List<HeroModel>> fetchRandomHeroes({int count = 20}) async {
    final ids = List<int>.generate(731, (i) => i + 1);
    ids.shuffle();
    final sampled = ids.take(count);
    final futures = sampled.map(fetchHero);
    final results = await Future.wait(futures.map((f) async {
      try {
        return await f;
      } catch (_) {
        return null;
      }
    }));
    return results.whereType<HeroModel>().toList(growable: false);
  }
}
