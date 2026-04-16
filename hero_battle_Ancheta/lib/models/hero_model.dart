import 'dart:convert';
import 'package:flutter/foundation.dart';

class PowerStats {
  final int intelligence, strength, speed;
  final int durability, power, combat;

  const PowerStats({
    required this.intelligence,
    required this.strength,
    required this.speed,
    required this.durability,
    required this.power,
    required this.combat,
  });

  // API returns strings; "null" strings fall back to 50
  factory PowerStats.fromJson(Map<String, dynamic> json) {
    int parse(String? v) =>
        (v == null || v == 'null') ? 50 : int.tryParse(v) ?? 50;
    return PowerStats(
      intelligence: parse(json['intelligence']?.toString()),
      strength: parse(json['strength']?.toString()),
      speed: parse(json['speed']?.toString()),
      durability: parse(json['durability']?.toString()),
      power: parse(json['power']?.toString()),
      combat: parse(json['combat']?.toString()),
    );
  }

  Map<String, dynamic> toJson() => {
        'intelligence': intelligence,
        'strength': strength,
        'speed': speed,
        'durability': durability,
        'power': power,
        'combat': combat,
      };
}

class HeroModel {
  static const List<String> _webImageProxies = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
  ];
  static const String _akababBase =
      'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images';

  final String id;
  final String name;
  final String imageUrl; // Original API URL from superheroapi.com
  final String publisher;
  final String alignment;
  final String fullName;
  final PowerStats powerStats;

  const HeroModel({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.powerStats,
    required this.publisher,
    required this.alignment,
    required this.fullName,
  });

  // Derived game stats
  int get maxHp => ((powerStats.durability + powerStats.power) / 2).round();
  int get attack => ((powerStats.strength + powerStats.combat) / 2).round();
  int get specialAttack =>
      ((powerStats.intelligence + powerStats.power) / 2).round();
  int get defense => ((powerStats.durability + powerStats.combat) / 4).round();
  int get initiative => powerStats.speed;

  String get _akababSlug {
    final normalized = name
        .toLowerCase()
        .replaceAll(RegExp(r'[^a-z0-9]+'), '-')
        .replaceAll(RegExp(r'-+'), '-')
        .replaceAll(RegExp(r'^-|-$'), '');
    if (normalized.isEmpty) return '';
    return '$id-$normalized';
  }

  List<String> get akababImageUrls {
    final slug = _akababSlug;
    if (slug.isEmpty) return const [];
    return [
      '$_akababBase/md/$slug.jpg',
      '$_akababBase/sm/$slug.jpg',
      '$_akababBase/lg/$slug.jpg',
    ];
  }

  // Public alternate image source.
  String get cdnImageUrl {
    return akababImageUrls.isNotEmpty ? akababImageUrls.first : '';
  }

  // Prefer API-provided image URL, then local fallback image.
  String get reliableImageUrl {
    if (imageUrl.isNotEmpty) {
      if (kIsWeb && imageUrl.startsWith('http')) {
        return '${_webImageProxies.first}${Uri.encodeComponent(imageUrl)}';
      }
      return imageUrl;
    }
    return fallbackImageUrl;
  }

  // Ordered URLs to try for rendering hero images.
  List<String> get imageUrlCandidates {
    final candidates = <String>[];

    void addIfValid(String url) {
      if (url.trim().isNotEmpty && !candidates.contains(url)) {
        candidates.add(url);
      }
    }

    if (imageUrl.isNotEmpty) {
      if (kIsWeb && imageUrl.startsWith('http')) {
        for (final proxy in _webImageProxies) {
          addIfValid('$proxy${Uri.encodeComponent(imageUrl)}');
        }
      }
      addIfValid(imageUrl);
    }

    if (cdnImageUrl.isNotEmpty) {
      addIfValid(cdnImageUrl);
    }

    for (final url in akababImageUrls) {
      addIfValid(url);
    }

    addIfValid(fallbackImageUrl);
    return candidates;
  }

  // Local SVG data URL fallback to avoid any web CORS issues.
  String get fallbackImageUrl {
    final safeName = name.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    final svg = '''<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="#d9e2ec"/><circle cx="150" cy="115" r="52" fill="#9fb3c8"/><rect x="70" y="184" width="160" height="90" rx="40" fill="#9fb3c8"/><text x="150" y="284" text-anchor="middle" font-family="Arial" font-size="20" fill="#334e68">$safeName</text></svg>''';
    return Uri.dataFromString(svg, mimeType: 'image/svg+xml', encoding: utf8).toString();
  }

  // Kept for backward compatibility
  String get workingImageUrl => reliableImageUrl;

  factory HeroModel.fromJson(Map<String, dynamic> json) {
    final nestedImageUrl = (json['image'] as Map?)?['url'] as String? ?? '';
    final topLevelImageUrl = json['url'] as String? ?? '';

    return HeroModel(
      id: json['id'].toString(),
      name: json['name'] as String? ?? 'Unknown',
      // Supports both:
      // - /{id} and /search/{name} payloads: image.url
      // - /{id}/image payloads: url
      imageUrl: nestedImageUrl.isNotEmpty ? nestedImageUrl : topLevelImageUrl,
      powerStats: PowerStats.fromJson(json['powerstats'] ?? {}),
      publisher: (json['biography'] as Map?)?.containsKey('publisher') == true
          ? (json['biography'] as Map)['publisher'] as String? ?? 'Unknown'
          : 'Unknown',
      alignment: (json['biography'] as Map?)?.containsKey('alignment') == true
          ? (json['biography'] as Map)['alignment'] as String? ?? 'neutral'
          : 'neutral',
      fullName: (json['biography'] as Map?)?.containsKey('full-name') == true
          ? (json['biography'] as Map)['full-name'] as String? ?? ''
          : '',
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'imageUrl': imageUrl,
        'publisher': publisher,
        'alignment': alignment,
        'fullName': fullName,
        'powerStats': powerStats.toJson(),
      };
}