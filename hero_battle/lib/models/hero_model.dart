import 'power_stats.dart';

class HeroModel {
  static const String IMAGE_BASE_URL =
      'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/';
  final String id, name, imageUrl, publisher, alignment, fullName;
  final PowerStats powerStats;
  final String? origin; // e.g. "Anime", "Manga", "Comics"

  const HeroModel({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.powerStats,
    required this.publisher,
    required this.alignment,
    required this.fullName,
    this.origin,
  });

  // Derived game stats
  int get maxHp => ((powerStats.durability + powerStats.power) / 2).round();
  int get attack => ((powerStats.strength + powerStats.combat) / 2).round();
  int get specialAttack =>
      ((powerStats.intelligence + powerStats.power) / 2).round();
  int get defense => ((powerStats.durability + powerStats.combat) / 4).round();
  int get initiative => powerStats.speed;

  factory HeroModel.fromJson(Map<String, dynamic> json) {
    final idStr = json['id'].toString();
    return HeroModel(
      id: idStr,
      name: json['name'] as String? ?? 'Unknown',
      imageUrl: (json['image'] as Map?)?['url'] as String? ?? '',
      powerStats: PowerStats.fromJson(json['powerstats'] ?? {}),
      publisher: (json['biography'] as Map?)?['publisher'] as String? ?? '',
      alignment:
          (json['biography'] as Map?)?['alignment'] as String? ?? 'neutral',
      fullName: (json['biography'] as Map?)?['full-name'] as String? ?? '',
      origin: json['origin'] as String?,
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
    if (origin != null) 'origin': origin,
  };
}
