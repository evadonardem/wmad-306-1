class PowerStats {
  final int intelligence, strength, speed, durability, power, combat;
  final double? powerPercent; // 0.0 - 100.0
  final String? details;

  const PowerStats({
    required this.intelligence,
    required this.strength,
    required this.speed,
    required this.durability,
    required this.power,
    required this.combat,
    this.powerPercent,
    this.details,
  });

  factory PowerStats.fromJson(Map<String, dynamic> json) {
    int parse(String? v) =>
        (v == null || v == 'null') ? 50 : int.tryParse(v) ?? 50;
    return PowerStats(
      intelligence: parse(json['intelligence']),
      strength: parse(json['strength']),
      speed: parse(json['speed']),
      durability: parse(json['durability']),
      power: parse(json['power']),
      combat: parse(json['combat']),
      powerPercent: (json['powerPercent'] is num)
          ? (json['powerPercent'] as num).toDouble()
          : (json['powerPercent'] != null
                ? double.tryParse(json['powerPercent'].toString())
                : null),
      details: json['details'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'intelligence': intelligence,
    'strength': strength,
    'speed': speed,
    'durability': durability,
    'power': power,
    'combat': combat,
    if (powerPercent != null) 'powerPercent': powerPercent,
    if (details != null) 'details': details,
  };
}
