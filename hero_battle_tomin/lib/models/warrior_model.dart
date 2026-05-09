class CoreStats {
  final int intelligence;
  final int strength;
  final int speed;
  final int durability;
  final int power;
  final int combat;

  const CoreStats({
    required this.intelligence,
    required this.strength,
    required this.speed,
    required this.durability,
    required this.power,
    required this.combat,
  });

  factory CoreStats.fromJson(Map<String, dynamic> json) {
    int parse(dynamic v) {
      if (v == null || v == 'null') return 50;
      if (v is int) return v;
      return int.tryParse(v.toString()) ?? 50;
    }

    return CoreStats(
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

class WarriorModel {
  final String id;
  final String name;
  final String imageUrl;
  final String publisher;
  final String alignment;
  final String fullName;
  final CoreStats coreStats;

  const WarriorModel({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.coreStats,
    required this.publisher,
    required this.alignment,
    required this.fullName,
  });

  // Vitality: weighted toward durability + strength (different from original's durability+power)
  int get vitality =>
      ((coreStats.durability * 1.2 + coreStats.strength * 0.8) / 2).round();

  // Strike: weighted toward combat (original uses strength+combat equally)
  int get strike =>
      ((coreStats.strength * 0.6 + coreStats.combat * 1.4) / 2).round();

  // Ultimate: weighted toward intelligence (original uses intelligence+power equally)
  int get ultimatePower =>
      ((coreStats.intelligence * 1.1 + coreStats.power * 0.9) / 2).round();

  // Resistance: similar but uses different weights
  int get resistance =>
      ((coreStats.durability * 1.1 + coreStats.combat * 0.9) / 4).round();

  // Agility: speed + small intelligence bonus (original uses speed alone)
  int get agility =>
      (coreStats.speed + (coreStats.intelligence / 8).round()).clamp(0, 120);

  factory WarriorModel.fromJson(Map<String, dynamic> json) {
    final biography = json['biography'];
    final image = json['image'];
    final statsJson = json['powerStats'] ?? json['powerstats'] ?? {};

    return WarriorModel(
      id: json['id'].toString(),
      name: json['name'] as String? ?? 'Unknown',
      imageUrl:
          json['imageUrl'] as String? ??
          (image is Map ? image['url'] as String? : null) ??
          '',
      coreStats: CoreStats.fromJson(
        statsJson is Map<String, dynamic>
            ? statsJson
            : Map<String, dynamic>.from(statsJson as Map),
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
    'powerStats': coreStats.toJson(),
  };
}

// Fallback warriors if API is unreachable
const List<WarriorModel> fallbackWarriors = [
  WarriorModel(
    id: '70',
    name: 'Batman',
    imageUrl: 'https://www.superherodb.com/pictures2/portraits/10/100/639.jpg',
    publisher: 'DC Comics',
    alignment: 'good',
    fullName: 'Bruce Wayne',
    coreStats: CoreStats(
      intelligence: 100,
      strength: 26,
      speed: 27,
      durability: 50,
      power: 47,
      combat: 100,
    ),
  ),
  WarriorModel(
    id: '644',
    name: 'Superman',
    imageUrl: 'https://www.superherodb.com/pictures2/portraits/10/100/791.jpg',
    publisher: 'DC Comics',
    alignment: 'good',
    fullName: 'Clark Kent',
    coreStats: CoreStats(
      intelligence: 94,
      strength: 100,
      speed: 100,
      durability: 100,
      power: 100,
      combat: 85,
    ),
  ),
  WarriorModel(
    id: '149',
    name: 'Captain America',
    imageUrl: 'https://www.superherodb.com/pictures2/portraits/10/100/274.jpg',
    publisher: 'Marvel Comics',
    alignment: 'good',
    fullName: 'Steve Rogers',
    coreStats: CoreStats(
      intelligence: 69,
      strength: 19,
      speed: 38,
      durability: 55,
      power: 60,
      combat: 100,
    ),
  ),
  WarriorModel(
    id: '346',
    name: 'Iron Man',
    imageUrl: 'https://www.superherodb.com/pictures2/portraits/10/100/85.jpg',
    publisher: 'Marvel Comics',
    alignment: 'good',
    fullName: 'Tony Stark',
    coreStats: CoreStats(
      intelligence: 100,
      strength: 85,
      speed: 58,
      durability: 85,
      power: 100,
      combat: 64,
    ),
  ),
  WarriorModel(
    id: '720',
    name: 'Wonder Woman',
    imageUrl: 'https://www.superherodb.com/pictures2/portraits/10/100/807.jpg',
    publisher: 'DC Comics',
    alignment: 'good',
    fullName: 'Diana Prince',
    coreStats: CoreStats(
      intelligence: 88,
      strength: 100,
      speed: 79,
      durability: 100,
      power: 100,
      combat: 100,
    ),
  ),
  WarriorModel(
    id: '620',
    name: 'Spider-Man',
    imageUrl: 'https://www.superherodb.com/pictures2/portraits/10/100/133.jpg',
    publisher: 'Marvel Comics',
    alignment: 'good',
    fullName: 'Peter Parker',
    coreStats: CoreStats(
      intelligence: 90,
      strength: 55,
      speed: 67,
      durability: 75,
      power: 74,
      combat: 85,
    ),
  ),
  WarriorModel(
    id: '655',
    name: 'Thor',
    imageUrl: 'https://www.superherodb.com/pictures2/portraits/10/100/140.jpg',
    publisher: 'Marvel Comics',
    alignment: 'good',
    fullName: 'Thor Odinson',
    coreStats: CoreStats(
      intelligence: 69,
      strength: 100,
      speed: 83,
      durability: 100,
      power: 100,
      combat: 100,
    ),
  ),
  WarriorModel(
    id: '332',
    name: 'Hulk',
    imageUrl: 'https://www.superherodb.com/pictures2/portraits/10/100/83.jpg',
    publisher: 'Marvel Comics',
    alignment: 'good',
    fullName: 'Bruce Banner',
    coreStats: CoreStats(
      intelligence: 88,
      strength: 100,
      speed: 63,
      durability: 100,
      power: 98,
      combat: 85,
    ),
  ),
];
