import 'package:flutter/material.dart';

enum HeroRarity { common, rare, epic, legendary }

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

  factory PowerStats.fromJson(Map<String, dynamic> json) {
    int parse(String? v) => (v == null || v == 'null') ? 50 : int.tryParse(v) ?? 50;
    return PowerStats(
      intelligence: parse(json['intelligence']),
      strength: parse(json['strength']),
      speed: parse(json['speed']),
      durability: parse(json['durability']),
      power: parse(json['power']),
      combat: parse(json['combat']),
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
  final String id, name, imageUrl, publisher, alignment, fullName;
  final PowerStats powerStats;
  final int stars;

  const HeroModel({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.powerStats,
    required this.publisher,
    required this.alignment,
    required this.fullName,
    this.stars = 0,
  });

  int get maxHp => ((powerStats.durability + powerStats.power) / 2).round();

  // Logic: +3 Damage per star. 3 Stars = +9 Damage.
  int get attack =>
      ((powerStats.strength + powerStats.combat) / 2).round() + (stars * 3);

  int get specialAttack =>
      ((powerStats.intelligence + powerStats.power) / 2).round();
  int get defense => ((powerStats.durability + powerStats.combat) / 4).round();
  int get initiative => powerStats.speed;

  // NEW Logic: Dynamic Upgrade Cost based on Rarity
  int get upgradeCost {
    int basePrice;
    switch (rarity) {
      case HeroRarity.legendary:
        basePrice = 2000;
        break;
      case HeroRarity.epic:
        basePrice = 1000;
        break;
      case HeroRarity.rare:
        basePrice = 750;
        break;
      case HeroRarity.common:
      default:
        basePrice = 500; // Your base price for common
        break;
    }
    // Cost scales with current star level: (Stars + 1) * Base Price
    return basePrice * (stars + 1);
  }

  String get role {
    if (powerStats.durability >= 75 && powerStats.strength >= 50) return 'Tank 🛡️';
    if (powerStats.intelligence >= 75) return 'Mage 🔮';
    if (powerStats.speed >= 75 && powerStats.combat >= 70) return 'Assassin 🗡️';
    if (powerStats.strength >= 75) return 'Fighter ⚔️';
    if (powerStats.intelligence >= 60 && powerStats.durability >= 60)
      return 'Support 🌿';
    return 'Marksman 🏹';
  }

  int get totalStats =>
      powerStats.intelligence +
      powerStats.strength +
      powerStats.speed +
      powerStats.durability +
      powerStats.power +
      powerStats.combat;

  HeroRarity get rarity {
    if (totalStats >= 500) return HeroRarity.legendary;
    if (totalStats >= 400) return HeroRarity.epic;
    if (totalStats >= 300) return HeroRarity.rare;
    return HeroRarity.common;
  }

  Color get rarityColor {
    switch (rarity) {
      case HeroRarity.legendary:
        return Colors.amber;
      case HeroRarity.epic:
        return Colors.purple;
      case HeroRarity.rare:
        return Colors.blue;
      case HeroRarity.common:
        return Colors.grey;
    }
  }

  HeroModel copyWith({int? stars}) {
    return HeroModel(
      id: id,
      name: name,
      imageUrl: imageUrl,
      powerStats: powerStats,
      publisher: publisher,
      alignment: alignment,
      fullName: fullName,
      stars: stars ?? this.stars,
    );
  }

  factory HeroModel.fromJson(Map<String, dynamic> json) {
    String rawUrl = '';
    final imageMap = json['image'];
    if (imageMap is Map && imageMap['url'] != null) {
      rawUrl = imageMap['url'] as String;
    } else if (json['imageUrl'] != null) {
      rawUrl = json['imageUrl'] as String;
    }

    if (rawUrl.startsWith('http://')) {
      rawUrl = rawUrl.replaceFirst('http://', 'https://');
    }

    return HeroModel(
      id: json['id'].toString(),
      name: json['name'] as String? ?? 'Unknown',
      imageUrl: rawUrl,
      powerStats: PowerStats.fromJson(json['powerstats'] ?? {}),
      publisher: (json['biography'] as Map?)?['publisher'] as String? ?? '',
      alignment: (json['biography'] as Map?)?['alignment'] as String? ?? 'neutral',
      fullName:
          (json['biography'] as Map?)?['full-name'] as String? ?? '',
      stars: json['stars'] ?? 0,
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
        'stars': stars,
      };
}