import 'skill.dart';

class PowerStats {
  final int intelligence;
  final int strength;
  final int speed;
  final int durability;
  final int power;
  final int combat;

  PowerStats({
    required this.intelligence,
    required this.strength,
    required this.speed,
    required this.durability,
    required this.power,
    required this.combat,
  });

  factory PowerStats.fromJson(Map<String, dynamic>? json) {
    int parse(dynamic v) {
      if (v == null || v.toString() == 'null') return 50;
      return int.tryParse(v.toString()) ?? 50;
    }

    return PowerStats(
      intelligence: parse(json?['intelligence']),
      strength: parse(json?['strength']),
      speed: parse(json?['speed']),
      durability: parse(json?['durability']),
      power: parse(json?['power']),
      combat: parse(json?['combat']),
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
  final PowerStats powerStats;

  /// 🎮 GAME FIELDS (keep for future skill system)
  final List<Skill> skills;
  int currentMana;

  HeroModel({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.powerStats,
    required this.skills,
    this.currentMana = 100,
  });

  /// ✅ FROM JSON (API)
  factory HeroModel.fromJson(Map<String, dynamic> json) {
    final images = json['images'] as Map<String, dynamic>?;

    final name = json['name']?.toString() ?? 'Unknown';
    final id = json['id']?.toString() ?? '';

    final imageUrl =
        images?['lg'] ??
        images?['md'] ??
        images?['sm'] ??
        'https://via.placeholder.com/300x400.png?text=${Uri.encodeComponent(name)}';

    final stats = PowerStats.fromJson(json['powerstats']);

    return HeroModel(
      id: id,
      name: name,
      imageUrl: imageUrl,
      powerStats: stats,

      /// 🔥 DEFAULT SKILLS (not used yet, safe to keep)
      skills: [
        Skill(
          name: "Punch",
          multiplier: 1.0,
          critChance: 0.1,
          type: SkillType.physical,
        ),
        Skill(
          name: "Power Blast",
          multiplier: 1.5,
          critChance: 0.2,
          type: SkillType.energy,
        ),
        Skill(
          name: "Ultimate",
          multiplier: 2.2,
          critChance: 0.3,
          type: SkillType.magic,
        ),
      ],
    );
  }

  /// ✅ FOR STORAGE
  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'imageUrl': imageUrl,
    'powerstats': powerStats.toJson(),
  };

  factory HeroModel.fromMap(Map<String, dynamic> map) {
    return HeroModel.fromJson(map);
  }

  /// 🎮 GAME STATS (used in battle)
  int get strength => powerStats.strength;
  int get power => powerStats.power;
  int get combat => powerStats.combat;
  int get durability => powerStats.durability;
  int get intelligence => powerStats.intelligence;

  /// ✅ Derived stats
  int get defense => ((durability + combat) / 2).round();

  /// 🔥 FIXED HP (important)
  int get maxHp => ((durability + power) * 2).round();
}
