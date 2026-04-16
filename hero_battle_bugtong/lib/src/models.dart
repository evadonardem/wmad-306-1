class PowerStats {
  const PowerStats({
    required this.intelligence,
    required this.strength,
    required this.speed,
    required this.durability,
    required this.power,
    required this.combat,
  });

  final int intelligence;
  final int strength;
  final int speed;
  final int durability;
  final int power;
  final int combat;

  Map<String, dynamic> toJson() {
    return {
      'intelligence': intelligence,
      'strength': strength,
      'speed': speed,
      'durability': durability,
      'power': power,
      'combat': combat,
    };
  }

  factory PowerStats.fromJson(Map<String, dynamic> json) {
    return PowerStats(
      intelligence: (json['intelligence'] as num).toInt(),
      strength: (json['strength'] as num).toInt(),
      speed: (json['speed'] as num).toInt(),
      durability: (json['durability'] as num).toInt(),
      power: (json['power'] as num).toInt(),
      combat: (json['combat'] as num).toInt(),
    );
  }
}

String _slugifyHeroName(String name) {
  return name
      .toLowerCase()
      .replaceAll(RegExp(r'[^a-z0-9]+'), '-')
      .replaceAll(RegExp(r'^-+|-+$'), '');
}

String normalizeHeroImageUrl({
  required String id,
  required String name,
  required String imageUrl,
}) {
  var normalized = imageUrl.trim();
  if (normalized.startsWith('http://')) {
    normalized = normalized.replaceFirst('http://', 'https://');
  }

  // superherodb.com portrait URLs are often blocked by anti-bot checks.
  if (normalized.isEmpty || normalized.contains('superherodb.com')) {
    final slug = _slugifyHeroName(name);
    return 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/$id-$slug.jpg';
  }

  return normalized;
}

class HeroModel {
  const HeroModel({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.publisher,
    required this.alignment,
    required this.fullName,
    required this.powerStats,
  });

  final String id;
  final String name;
  final String imageUrl;
  final String publisher;
  final String alignment;
  final String fullName;
  final PowerStats powerStats;

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'imageUrl': imageUrl,
      'publisher': publisher,
      'alignment': alignment,
      'fullName': fullName,
      'powerStats': powerStats.toJson(),
    };
  }

  factory HeroModel.fromJson(Map<String, dynamic> json) {
    final id = json['id'] as String;
    final name = json['name'] as String;
    final imageUrl = json['imageUrl'] as String;
    return HeroModel(
      id: id,
      name: name,
      imageUrl: normalizeHeroImageUrl(id: id, name: name, imageUrl: imageUrl),
      publisher: json['publisher'] as String,
      alignment: json['alignment'] as String,
      fullName: json['fullName'] as String,
      powerStats: PowerStats.fromJson(json['powerStats'] as Map<String, dynamic>),
    );
  }
}

class BattleRecord {
  const BattleRecord({
    required this.id,
    required this.playerHero,
    required this.aiHero,
    required this.playerWon,
    required this.roundsPlayed,
    required this.playedAt,
  });

  final String id;
  final String playerHero;
  final String aiHero;
  final bool playerWon;
  final int roundsPlayed;
  final DateTime playedAt;

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'playerHero': playerHero,
      'aiHero': aiHero,
      'playerWon': playerWon,
      'roundsPlayed': roundsPlayed,
      'playedAt': playedAt.toIso8601String(),
    };
  }

  factory BattleRecord.fromJson(Map<String, dynamic> json) {
    return BattleRecord(
      id: json['id'] as String,
      playerHero: json['playerHero'] as String,
      aiHero: json['aiHero'] as String,
      playerWon: json['playerWon'] as bool,
      roundsPlayed: (json['roundsPlayed'] as num).toInt(),
      playedAt: DateTime.parse(json['playedAt'] as String),
    );
  }
}
