// Data model for a superhero fetched from the Superhero API.
// Safely handles string-typed powerstats and "null" values.

class PowerStats {
  final int intelligence;
  final int strength;
  final int speed;
  final int durability;
  final int power;
  final int combat;

  const PowerStats({
    this.intelligence = 0,
    this.strength = 0,
    this.speed = 0,
    this.durability = 0,
    this.power = 0,
    this.combat = 0,
  });

  /// Safely parse a powerstat value (may be String, int, or literal "null")
  static int _safe(dynamic v) {
    if (v == null || v == 'null') return 0;
    if (v is int) return v;
    return int.tryParse(v.toString()) ?? 0;
  }

  factory PowerStats.fromJson(Map<String, dynamic> json) => PowerStats(
        intelligence: _safe(json['intelligence']),
        strength: _safe(json['strength']),
        speed: _safe(json['speed']),
        durability: _safe(json['durability']),
        power: _safe(json['power']),
        combat: _safe(json['combat']),
      );

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
  final int id;
  final String name;
  final PowerStats powerstats;
  final String imageUrl;
  final String fullName;
  final String alignment;
  final String publisher;

  const HeroModel({
    required this.id,
    required this.name,
    required this.powerstats,
    this.imageUrl = '',
    this.fullName = '',
    this.alignment = 'unknown',
    this.publisher = 'Unknown',
  });

  // ── Derived game stats used in battle ──
  int get hp => 100 + (powerstats.durability * 3) + powerstats.strength;
  int get attack => powerstats.strength + (powerstats.combat ~/ 2);
  int get defense => powerstats.durability + (powerstats.combat ~/ 3);
  int get specialAttack => powerstats.power + (powerstats.intelligence ~/ 2);
  int get speed => powerstats.speed;

  HeroModel copyWith({String? imageUrl}) => HeroModel(
        id: id,
        name: name,
        powerstats: powerstats,
        imageUrl: imageUrl ?? this.imageUrl,
        fullName: fullName,
        alignment: alignment,
        publisher: publisher,
      );

  // ── JSON from Superhero API response ──
  factory HeroModel.fromJson(Map<String, dynamic> json) {
    final ps = json['powerstats'];
    final bio = json['biography'] ?? <String, dynamic>{};
    final img = json['image'] ?? <String, dynamic>{};

    return HeroModel(
      id: _safeId(json['id']),
      name: (json['name'] ?? 'Unknown').toString(),
      powerstats:
          ps is Map<String, dynamic> ? PowerStats.fromJson(ps) : const PowerStats(),
      imageUrl: (img['url'] ?? '').toString(),
      fullName: (bio['full-name'] ?? '').toString(),
      alignment: (bio['alignment'] ?? 'unknown').toString(),
      publisher: (bio['publisher'] ?? 'Unknown').toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'powerstats': powerstats.toJson(),
        'image': {'url': imageUrl},
        'biography': {
          'full-name': fullName,
          'alignment': alignment,
          'publisher': publisher,
        },
      };

  // ── Compact JSON for SQLite deck storage ──
  Map<String, dynamic> toCompactJson() => {
        'id': id,
        'name': name,
        'imageUrl': imageUrl,
        'fullName': fullName,
        'alignment': alignment,
        'publisher': publisher,
        ...powerstats.toJson(),
      };

  factory HeroModel.fromCompactJson(Map<String, dynamic> json) => HeroModel(
        id: _safeId(json['id']),
        name: (json['name'] ?? 'Unknown').toString(),
        imageUrl: (json['imageUrl'] ?? '').toString(),
        fullName: (json['fullName'] ?? '').toString(),
        alignment: (json['alignment'] ?? 'unknown').toString(),
        publisher: (json['publisher'] ?? 'Unknown').toString(),
        powerstats: PowerStats(
          intelligence: json['intelligence'] ?? 0,
          strength: json['strength'] ?? 0,
          speed: json['speed'] ?? 0,
          durability: json['durability'] ?? 0,
          power: json['power'] ?? 0,
          combat: json['combat'] ?? 0,
        ),
      );

  static int _safeId(dynamic v) {
    if (v is int) return v;
    return int.tryParse(v.toString()) ?? 0;
  }
}
