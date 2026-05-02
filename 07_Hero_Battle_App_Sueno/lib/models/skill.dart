enum SkillType { physical, energy, magic }

class Skill {
  final String name;
  final double multiplier;
  final double critChance;
  final SkillType type;

  bool isReady;

  Skill({
    required this.name,
    required this.multiplier,
    required this.critChance,
    required this.type,
    this.isReady = true,
  });
}
