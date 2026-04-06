import 'package:flutter/material.dart';
import '../models/adopter_profile.dart';
import '../models/dog.dart';

class DogMatch {
  final Dog dog;
  final double compatibilityScore;
  final List<String> reasons;

  DogMatch({
    required this.dog,
    required this.compatibilityScore,
    required this.reasons,
  });

  String get scoreLabel {
    if (compatibilityScore >= 80) return 'Great';
    if (compatibilityScore >= 60) return 'Good';
    return 'Fair';
  }

  Color get scoreColor {
    if (compatibilityScore >= 80) return Colors.green;
    if (compatibilityScore >= 60) return Colors.orange;
    return Colors.red;
  }
}

class MatchingService {
  static List<DogMatch> getRecommendedDogs(
    AdopterProfile profile,
    List<Dog> dogs,
  ) {
    final sorted = List<Dog>.from(dogs);
    sorted.sort((a, b) {
      final aScore = a.compatibilityScore ?? 50.0;
      final bScore = b.compatibilityScore ?? 50.0;
      return bScore.compareTo(aScore);
    });

    return sorted.take(10).map((dog) {
      final reasons = <String>[];
      if (dog.compatibilityScore != null) {
        reasons.add('Good compatibility score');
      }
      if (dog.isAvailable == true) {
        reasons.add('Available for adoption');
      }
      if (dog.characteristics.isNotEmpty) {
        reasons.add('Matches your lifestyle traits');
      }
      return DogMatch(
        dog: dog,
        compatibilityScore: dog.compatibilityScore ?? 50.0,
        reasons: reasons.isNotEmpty ? reasons : ['Recommended for your profile'],
      );
    }).toList();
  }
}
