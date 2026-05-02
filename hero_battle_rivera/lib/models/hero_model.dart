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

  factory PowerStats.fromJson(Map<String, dynamic> json) {
    int parse(dynamic value) {
      if (value == null) return 50;

      final normalized = value.toString().trim().toLowerCase();
      if (normalized.isEmpty || normalized == 'null') {
        return 50;
      }

      return int.tryParse(normalized) ?? 50;
    }

    return PowerStats(
      intelligence: parse(json['intelligence']),
      strength: parse(json['strength']),
      speed: parse(json['speed']),
      durability: parse(json['durability']),
      power: parse(json['power']),
      combat: parse(json['combat']),
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'intelligence': intelligence,
      'strength': strength,
      'speed': speed,
      'durability': durability,
      'power': power,
      'combat': combat,
    };
  }
}

class HeroModel {
  const HeroModel({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.powerStats,
    required this.publisher,
    required this.alignment,
    required this.fullName,
  });

  final String id;
  final String name;
  final String imageUrl;
  final String publisher;
  final String alignment;
  final String fullName;
  final PowerStats powerStats;

  int get maxHp => ((powerStats.durability + powerStats.power) / 2).round();
  int get attack => ((powerStats.strength + powerStats.combat) / 2).round();

  int get specialAttack =>
      ((powerStats.intelligence + powerStats.power) / 2).round();

  int get defense => ((powerStats.durability + powerStats.combat) / 4).round();
  int get initiative => powerStats.speed;

  // Compatibility getters used by existing screens/widgets.
  int get intelligence => powerStats.intelligence;
  int get strength => powerStats.strength;
  int get speed => powerStats.speed;
  int get durability => powerStats.durability;
  int get power => powerStats.power;
  int get combat => powerStats.combat;
  int get baseHp => maxHp;
  int get attackPower => attack;

  HeroModel copyWith({
    String? id,
    String? name,
    String? imageUrl,
    PowerStats? powerStats,
    String? publisher,
    String? alignment,
    String? fullName,
  }) {
    return HeroModel(
      id: id ?? this.id,
      name: name ?? this.name,
      imageUrl: imageUrl ?? this.imageUrl,
      powerStats: powerStats ?? this.powerStats,
      publisher: publisher ?? this.publisher,
      alignment: alignment ?? this.alignment,
      fullName: fullName ?? this.fullName,
    );
  }

  factory HeroModel.fromJson(Map<String, dynamic> json) {
    final image = _asMap(json['image']);
    final biography = _asMap(json['biography']);
    final powerStats = _asMap(json['powerstats'] ?? json['powerStats']);

    return HeroModel(
      id: _asString(json['id'], fallback: '0'),
      name: _asString(json['name'], fallback: 'Unknown'),
      imageUrl: _asString(
        json['imageUrl'],
        fallback: _asString(image['url'], fallback: _asString(json['url'])),
      ),
      powerStats: PowerStats.fromJson(powerStats),
      publisher: _asString(
        json['publisher'],
        fallback: _asString(biography['publisher']),
      ),
      alignment: _asString(
        json['alignment'],
        fallback: _asString(biography['alignment'], fallback: 'neutral'),
      ),
      fullName: _asString(
        json['fullName'],
        fallback: _asString(biography['full-name']),
      ),
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'name': name,
      'imageUrl': imageUrl,
      'publisher': publisher,
      'alignment': alignment,
      'fullName': fullName,
      'powerStats': powerStats.toJson(),
    };
  }

  static Map<String, dynamic> _asMap(dynamic value) {
    if (value is Map) {
      return Map<String, dynamic>.from(value);
    }
    return const <String, dynamic>{};
  }

  static String _asString(dynamic value, {String fallback = ''}) {
    if (value == null) return fallback;
    final normalized = value.toString().trim();
    if (normalized.isEmpty || normalized.toLowerCase() == 'null') {
      return fallback;
    }
    return normalized;
  }
}
