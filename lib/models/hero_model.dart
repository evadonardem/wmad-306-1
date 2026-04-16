class HeroModel {
  final int id;
  final String name;
  final String description;
  final HeroImage image;
  final Powerstats powerstats;
  final Biography biography;
  final Appearance appearance;
  final Work work;
  final Connections connections;
  final String publisherName;

  HeroModel({
    required this.id,
    required this.name,
    required this.description,
    required this.image,
    required this.powerstats,
    required this.biography,
    required this.appearance,
    required this.work,
    required this.connections,
    required this.publisherName,
  });

  factory HeroModel.fromJson(Map<String, dynamic> json) {
    return HeroModel(
      id: int.tryParse(json['id'].toString()) ?? 0,
      name: json['name'] ?? 'Unknown',
      description: json['response'] ?? 'No description',
      image: HeroImage.fromJson(json['image'] ?? {}),
      powerstats: Powerstats.fromJson(json['powerstats'] ?? {}),
      biography: Biography.fromJson(json['biography'] ?? {}),
      appearance: Appearance.fromJson(json['appearance'] ?? {}),
      work: Work.fromJson(json['work'] ?? {}),
      connections: Connections.fromJson(json['connections'] ?? {}),
      publisherName: json['biography']?['publisher'] ?? 'Unknown',
    );
  }

  // Get card rarity based on power level
  CardRarity getRarity() {
    int totalPower = powerstats.totalPower;
    if (totalPower >= 450) return CardRarity.legendary;
    if (totalPower >= 350) return CardRarity.epic;
    if (totalPower >= 250) return CardRarity.rare;
    if (totalPower >= 150) return CardRarity.uncommon;
    return CardRarity.common;
  }

  // Get color based on alignment
  String getAlignmentColor() {
    final alignment = biography.alignment.toLowerCase();
    if (alignment.contains('good')) return '4CAF50';
    if (alignment.contains('bad')) return 'F44336';
    return '9C27B0';
  }
}

class HeroImage {
  final String url;

  HeroImage({required this.url});

  factory HeroImage.fromJson(Map<String, dynamic> json) {
    return HeroImage(
      url: json['url'] ?? '',
    );
  }
}

class Powerstats {
  final int intelligence;
  final int strength;
  final int speed;
  final int durability;
  final int power;
  final int combat;

  Powerstats({
    required this.intelligence,
    required this.strength,
    required this.speed,
    required this.durability,
    required this.power,
    required this.combat,
  });

  int get totalPower =>
      intelligence + strength + speed + durability + power + combat;

  int get health => durability * 10;

  factory Powerstats.fromJson(Map<String, dynamic> json) {
    int parseInt(dynamic value) {
      if (value == null || value == 'null') return 0;
      if (value is int) return value;
      return int.tryParse(value.toString()) ?? 0;
    }

    return Powerstats(
      intelligence: parseInt(json['intelligence']),
      strength: parseInt(json['strength']),
      speed: parseInt(json['speed']),
      durability: parseInt(json['durability']),
      power: parseInt(json['power']),
      combat: parseInt(json['combat']),
    );
  }
}

class Biography {
  final String fullName;
  final String alterEgos;
  final List<String> aliases;
  final String placeOfBirth;
  final String firstAppearance;
  final String publisher;
  final String alignment;

  Biography({
    required this.fullName,
    required this.alterEgos,
    required this.aliases,
    required this.placeOfBirth,
    required this.firstAppearance,
    required this.publisher,
    required this.alignment,
  });

  factory Biography.fromJson(Map<String, dynamic> json) {
    List<String> parseAliases(dynamic value) {
      if (value is String && value.isNotEmpty && value != '-') {
        return value.split(',').map((e) => e.trim()).toList();
      }
      return [];
    }

    return Biography(
      fullName: json['full-name'] ?? 'Unknown',
      alterEgos: json['alter-egos'] ?? '-',
      aliases: parseAliases(json['aliases']),
      placeOfBirth: json['place-of-birth'] ?? 'Unknown',
      firstAppearance: json['first-appearance'] ?? 'Unknown',
      publisher: json['publisher'] ?? 'Unknown',
      alignment: json['alignment'] ?? 'neutral',
    );
  }
}

class Appearance {
  final String gender;
  final String race;
  final List<String> height;
  final List<String> weight;
  final String eyeColor;
  final String hairColor;

  Appearance({
    required this.gender,
    required this.race,
    required this.height,
    required this.weight,
    required this.eyeColor,
    required this.hairColor,
  });

  factory Appearance.fromJson(Map<String, dynamic> json) {
    return Appearance(
      gender: json['gender'] ?? 'Unknown',
      race: json['race'] ?? 'Unknown',
      height: List<String>.from(json['height'] ?? []),
      weight: List<String>.from(json['weight'] ?? []),
      eyeColor: json['eye-color'] ?? 'Unknown',
      hairColor: json['hair-color'] ?? 'Unknown',
    );
  }
}

class Work {
  final String occupation;
  final String baseOfOperations;

  Work({
    required this.occupation,
    required this.baseOfOperations,
  });

  factory Work.fromJson(Map<String, dynamic> json) {
    return Work(
      occupation: json['occupation'] ?? 'Unknown',
      baseOfOperations: json['base-of-operations'] ?? 'Unknown',
    );
  }
}

class Connections {
  final String groupAffiliation;
  final String relatives;

  Connections({
    required this.groupAffiliation,
    required this.relatives,
  });

  factory Connections.fromJson(Map<String, dynamic> json) {
    return Connections(
      groupAffiliation: json['group-affiliation'] ?? 'None',
      relatives: json['relatives'] ?? 'None',
    );
  }
}

enum CardRarity {
  common, // Gray
  uncommon, // Green
  rare, // Blue
  epic, // Purple
  legendary, // Gold
}

extension CardRarityExt on CardRarity {
  String get displayName {
    switch (this) {
      case CardRarity.common:
        return 'Common';
      case CardRarity.uncommon:
        return 'Uncommon';
      case CardRarity.rare:
        return 'Rare';
      case CardRarity.epic:
        return 'Epic';
      case CardRarity.legendary:
        return 'Legendary';
    }
  }

  String get color {
    switch (this) {
      case CardRarity.common:
        return '9E9E9E';
      case CardRarity.uncommon:
        return '4CAF50';
      case CardRarity.rare:
        return '2196F3';
      case CardRarity.epic:
        return '9C27B0';
      case CardRarity.legendary:
        return 'FFB300';
    }
  }

  double get glowIntensity {
    switch (this) {
      case CardRarity.common:
        return 0.2;
      case CardRarity.uncommon:
        return 0.4;
      case CardRarity.rare:
        return 0.6;
      case CardRarity.epic:
        return 0.8;
      case CardRarity.legendary:
        return 1.0;
    }
  }
}
