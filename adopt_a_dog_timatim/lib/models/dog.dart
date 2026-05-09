import 'dart:math';

/// Lightweight model used in the gallery grid.
/// Mirrors the documented `GET /api/dogs` shape.
class DogSummary {
  final String id;
  final String name;
  final String thumbnailUrl;
  final int age;
  final String size; // Small | Medium | Large
  final String primaryTrait; // Calm | Energetic | Playful | ...
  final String breed;

  const DogSummary({
    required this.id,
    required this.name,
    required this.thumbnailUrl,
    required this.age,
    required this.size,
    required this.primaryTrait,
    required this.breed,
  });

  bool get isPuppy => age <= 1;
  bool get isSenior => age >= 8;

  factory DogSummary.fromJson(Map<String, dynamic> json) => DogSummary(
        id: json['id'].toString(),
        name: json['name'] as String,
        thumbnailUrl: json['thumbnailUrl'] as String,
        age: json['age'] as int,
        size: json['size'] as String,
        primaryTrait: json['primaryTrait'] as String,
        breed: json['breed'] as String,
      );
}

/// Full record used in the detail screen.
/// Mirrors the documented `GET /api/dogs/{id}` shape.
class Dog {
  final String id;
  final String name;
  final int age;
  final String size;
  final double weight; // kg
  final String breed;
  final String bio;
  final List<String> fullPhotos;
  final String location;
  final bool goodWithKids;
  final bool goodWithDogs;
  final int energyLevel; // 1..5
  final String primaryTrait;

  const Dog({
    required this.id,
    required this.name,
    required this.age,
    required this.size,
    required this.weight,
    required this.breed,
    required this.bio,
    required this.fullPhotos,
    required this.location,
    required this.goodWithKids,
    required this.goodWithDogs,
    required this.energyLevel,
    required this.primaryTrait,
  });

  String get heroPhoto => fullPhotos.isNotEmpty ? fullPhotos.first : '';

  factory Dog.fromJson(Map<String, dynamic> json) => Dog(
        id: json['id'].toString(),
        name: json['name'] as String,
        age: json['age'] as int,
        size: json['size'] as String,
        weight: (json['weight'] as num).toDouble(),
        breed: json['breed'] as String,
        bio: json['bio'] as String,
        fullPhotos: List<String>.from(json['fullPhotos'] as List),
        location: json['location'] as String,
        goodWithKids: json['goodWithKids'] as bool,
        goodWithDogs: json['goodWithDogs'] as bool,
        energyLevel: json['energyLevel'] as int,
        primaryTrait: json['primaryTrait'] as String,
      );
}

/// Deterministic random — given the same breed id we always produce the
/// same fake adoption data, so the gallery is stable across rebuilds.
Random seededRandom(String seed) => Random(seed.hashCode);
