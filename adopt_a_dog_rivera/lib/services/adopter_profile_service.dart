import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/adopter_profile.dart';

/// Service for managing adopter profiles and preferences
class AdopterProfileService {
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// Create or update adopter profile
  static Future<void> saveProfile(AdopterProfile profile) async {
    try {
      print('AdopterProfileService: Saving profile for user: ${profile.userId}');
      
      final docRef = _firestore
          .collection('users')
          .doc(profile.userId)
          .collection('adopterProfile')
          .doc('profile');

      await docRef.set(profile.toFirestore());
      
      print('AdopterProfileService: Profile saved successfully');
    } catch (e) {
      throw Exception('Failed to save adopter profile: $e');
    }
  }

  /// Get adopter profile
  static Future<AdopterProfile?> getProfile(String userId) async {
    try {
      print('AdopterProfileService: Fetching profile for user: $userId');
      
      final doc = await _firestore
          .collection('users')
          .doc(userId)
          .collection('adopterProfile')
          .doc('profile')
          .get();

      if (doc.exists) {
        return AdopterProfile.fromFirestore(doc);
      }
      
      print('AdopterProfileService: Profile not found, creating default');
      return null;
    } catch (e) {
      throw Exception('Failed to get adopter profile: $e');
    }
  }

  /// Get adopter profile as a stream
  static Stream<AdopterProfile?> getProfileStream(String userId) {
    return _firestore
        .collection('users')
        .doc(userId)
        .collection('adopterProfile')
        .doc('profile')
        .snapshots()
        .map((doc) {
      if (doc.exists) {
        return AdopterProfile.fromFirestore(doc);
      }
      return null;
    });
  }

  /// Update profile preferences
  static Future<void> updatePreferences({
    required String userId,
    String? livingType,
    List<String>? preferredBreeds,
    String? preferredEnergyLevel,
    String? preferredSize,
    int? minimumAge,
    int? maximumAge,
    List<String>? interests,
  }) async {
    try {
      await _firestore
          .collection('users')
          .doc(userId)
          .collection('adopterProfile')
          .doc('profile')
          .update({
        'livingType': ?livingType,
        'preferredBreeds': ?preferredBreeds,
        'preferredEnergyLevel': ?preferredEnergyLevel,
        'preferredSize': ?preferredSize,
        'minimumAge': ?minimumAge,
        'maximumAge': ?maximumAge,
        'interests': ?interests,
        'updatedAt': FieldValue.serverTimestamp(),
      });

      print('AdopterProfileService: Preferences updated for user: $userId');
    } catch (e) {
      throw Exception('Failed to update preferences: $e');
    }
  }

  /// Update household information
  static Future<void> updateHousehold({
    required String userId,
    int? householdSize,
    List<String>? householdMembers,
    bool? hasPets,
    int? numberOfPets,
    List<String>? petsTypes,
    bool? hasYard,
  }) async {
    try {
      await _firestore
          .collection('users')
          .doc(userId)
          .collection('adopterProfile')
          .doc('profile')
          .update({
        'householdSize': ?householdSize,
        'householdMembers': ?householdMembers,
        'hasPets': ?hasPets,
        'numberOfPets': ?numberOfPets,
        'petsTypes': ?petsTypes,
        'hasYard': ?hasYard,
        'updatedAt': FieldValue.serverTimestamp(),
      });

      print('AdopterProfileService: Household info updated for user: $userId');
    } catch (e) {
      throw Exception('Failed to update household info: $e');
    }
  }

  /// Update bio/about
  static Future<void> updateBio(String userId, String bio) async {
    try {
      await _firestore
          .collection('users')
          .doc(userId)
          .collection('adopterProfile')
          .doc('profile')
          .update({
        'bio': bio,
        'updatedAt': FieldValue.serverTimestamp(),
      });

      print('AdopterProfileService: Bio updated for user: $userId');
    } catch (e) {
      throw Exception('Failed to update bio: $e');
    }
  }

  /// Update contact information
  static Future<void> updateContact({
    required String userId,
    String? phoneNumber,
    String? preferredContactMethod,
  }) async {
    try {
      await _firestore
          .collection('users')
          .doc(userId)
          .collection('adopterProfile')
          .doc('profile')
          .update({
        'phoneNumber': ?phoneNumber,
        'preferredContactMethod': ?preferredContactMethod,
        'updatedAt': FieldValue.serverTimestamp(),
      });

      print('AdopterProfileService: Contact info updated for user: $userId');
    } catch (e) {
      throw Exception('Failed to update contact info: $e');
    }
  }

  /// Calculate compatibility score between adopter and dog
  static double calculateCompatibility(
      AdopterProfile profile, dynamic dog) {
    double score = 50.0; // Start with base score

    // Energy level compatibility
    if (profile.preferredEnergyLevel != null) {
      if (profile.preferredEnergyLevel == dog.energyLevel) {
        score += 15;
      } else if ((profile.preferredEnergyLevel == 'low' &&
              dog.energyLevel == 'medium') ||
          (profile.preferredEnergyLevel == 'medium' &&
              dog.energyLevel == 'high')) {
        score += 10;
      }
    }

    // Breed preference
    if (profile.preferredBreeds.contains(dog.breed)) {
      score += 15;
    }

    // Size compatibility
    if (profile.preferredSize != null) {
      // Assuming size is derived from weight or breed characteristics
      score += 10;
    }

    // Age compatibility
    if (profile.minimumAge != null && profile.maximumAge != null) {
      if (dog.age != null &&
          dog.age! >= profile.minimumAge! &&
          dog.age! <= profile.maximumAge!) {
        score += 10;
      }
    }

    // Household compatibility
    if (profile.hasPets && dog.behaviors.contains('friendly')) {
      score += 10;
    }

    // Experience level
    if (profile.experience == 'beginner' &&
        dog.behaviors.contains('gentle')) {
      score += 10;
    } else if (profile.experience == 'experienced' &&
        dog.behaviors.contains('intelligent')) {
      score += 10;
    }

    // Cap at 100
    return score > 100 ? 100.0 : score;
  }
}
