class PowerStats {
  final int intelligence;
  final int strength;
  final int speed;
  final int durability;
  final int power;
  final int combat;

  const PowerStats({
    required this.intelligence,
    required this.strength,
    required this.speed,
    required this.durability,
    required this.power,
    required this.combat,
  });

  factory PowerStats.fromJson(Map<String, dynamic> json) {
    int parse(dynamic value) {
      if (value == null || value == 'null') return 50;
      if (value is int) return value;
      return int.tryParse(value.toString()) ?? 50;
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
  final String id;
  final String name;
  final String imageUrl;
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

  int get maxHp => ((powerStats.durability + powerStats.power) / 2).round();
  int get attack => ((powerStats.strength + powerStats.combat) / 2).round();
  int get specialAttack =>
      ((powerStats.intelligence + powerStats.power) / 2).round();
  int get defense => ((powerStats.durability + powerStats.combat) / 4).round();
  int get initiative => powerStats.speed;

  factory HeroModel.fromJson(Map<String, dynamic> json) {
    final biography = json['biography'];
    final image = json['image'];
    final powerStatsJson = json['powerStats'] ?? json['powerstats'] ?? {};

    return HeroModel(
      id: json['id'].toString(),
      name: json['name'] as String? ?? 'Unknown',
      imageUrl:
          json['imageUrl'] as String? ??
          (image is Map ? image['url'] as String? : null) ??
          '',
      powerStats: PowerStats.fromJson(
        powerStatsJson is Map<String, dynamic>
            ? powerStatsJson
            : Map<String, dynamic>.from(powerStatsJson as Map),
      ),
      publisher:
          json['publisher'] as String? ??
          (biography is Map ? biography['publisher'] as String? : null) ??
          'Unknown',
      alignment:
          json['alignment'] as String? ??
          (biography is Map ? biography['alignment'] as String? : null) ??
          'neutral',
      fullName:
          json['fullName'] as String? ??
          (biography is Map ? biography['full-name'] as String? : null) ??
          '',
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
