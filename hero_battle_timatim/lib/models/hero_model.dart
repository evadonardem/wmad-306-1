// Manual §5.1 — HeroModel + PowerStats with manual fromJson/toJson.
// API returns powerstats as strings; "null" strings fall back to 50.

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
    // akabab/superhero-api returns ints (and uses -1 for unknown).
    // Fall back to 50 for null / "null" / negative / unparseable.
    int parse(dynamic v) {
      if (v is int) return v < 0 ? 50 : v;
      if (v == null || v == 'null') return 50;
      if (v is String) {
        final n = int.tryParse(v);
        return (n == null || n < 0) ? 50 : n;
      }
      return 50;
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

  /// Used by HeroCard to surface the hero's three highest powerstats.
  List<MapEntry<String, int>> sortedEntries() {
    final entries = <MapEntry<String, int>>[
      MapEntry('Intelligence', intelligence),
      MapEntry('Strength', strength),
      MapEntry('Speed', speed),
      MapEntry('Durability', durability),
      MapEntry('Power', power),
      MapEntry('Combat', combat),
    ];
    entries.sort((a, b) => b.value.compareTo(a.value));
    return entries;
  }
}

class HeroModel {
  final String id, name, imageUrl, publisher, alignment, fullName;
  final PowerStats powerStats;

  const HeroModel({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.publisher,
    required this.alignment,
    required this.fullName,
    required this.powerStats,
  });

  // Derived game stats — used by BattleEngine.
  int get maxHp => ((powerStats.durability + powerStats.power) / 2).round();
  int get attack => ((powerStats.strength + powerStats.combat) / 2).round();
  int get specialAttack =>
      ((powerStats.intelligence + powerStats.power) / 2).round();
  int get defense =>
      ((powerStats.durability + powerStats.combat) / 4).round();
  int get initiative => powerStats.speed;

  factory HeroModel.fromJson(Map<String, dynamic> json) {
    final bio = (json['biography'] as Map?)?.cast<String, dynamic>() ?? {};
    // akabab uses `images.lg/md/sm/xs`; legacy superheroapi.com uses `image.url`.
    final images = (json['images'] as Map?)?.cast<String, dynamic>();
    final legacyImage = (json['image'] as Map?)?.cast<String, dynamic>();
    final imageUrl = (images?['lg'] ??
            images?['md'] ??
            images?['sm'] ??
            legacyImage?['url'] ??
            '') as String;

    return HeroModel(
      id: json['id'].toString(),
      name: json['name'] as String? ?? 'Unknown',
      imageUrl: imageUrl,
      powerStats: PowerStats.fromJson(
        (json['powerstats'] as Map?)?.cast<String, dynamic>() ?? {},
      ),
      publisher: bio['publisher'] as String? ?? '',
      alignment: bio['alignment'] as String? ?? 'neutral',
      // akabab → `fullName`, legacy → `full-name`.
      fullName: (bio['fullName'] ?? bio['full-name'] ?? '') as String,
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

  /// Used when reading heroes back from a saved deck (DB stores via toJson).
  factory HeroModel.fromStoredJson(Map<String, dynamic> json) {
    final ps = (json['powerStats'] as Map).cast<String, dynamic>();
    return HeroModel(
      id: json['id'] as String,
      name: json['name'] as String,
      imageUrl: json['imageUrl'] as String,
      publisher: json['publisher'] as String,
      alignment: json['alignment'] as String,
      fullName: json['fullName'] as String,
      powerStats: PowerStats(
        intelligence: ps['intelligence'] as int,
        strength: ps['strength'] as int,
        speed: ps['speed'] as int,
        durability: ps['durability'] as int,
        power: ps['power'] as int,
        combat: ps['combat'] as int,
      ),
    );
  }
}
