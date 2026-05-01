import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class FirestoreService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final _auth = FirebaseAuth.instance;

  // ==================== USER COLLECTION ====================

  /// Save user profile to Firestore
  Future<void> saveUserProfile({
    required String userId,
    required String email,
    required String role, // adopter, shelter, admin
    required Map<String, dynamic> additionalData,
  }) async {
    try {
      await _firestore.collection('users').doc(userId).set({
        'email': email,
        'role': role,
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
        ...additionalData,
      }, SetOptions(merge: true));
    } catch (e) {
      throw Exception('Error saving user profile: $e');
    }
  }

  /// Get user profile
  Future<DocumentSnapshot> getUserProfile(String userId) async {
    try {
      return await _firestore.collection('users').doc(userId).get();
    } catch (e) {
      throw Exception('Error getting user profile: $e');
    }
  }

  /// Get current user's profile
  Future<Map<String, dynamic>?> getCurrentUserProfile() async {
    try {
      final userId = _auth.currentUser?.uid;
      if (userId == null) return null;

      final doc = await _firestore.collection('users').doc(userId).get();
      return doc.data();
    } catch (e) {
      throw Exception('Error getting current user profile: $e');
    }
  }

  /// Update user profile
  Future<void> updateUserProfile(String userId, Map<String, dynamic> data) async {
    try {
      await _firestore.collection('users').doc(userId).update({
        ...data,
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      throw Exception('Error updating user profile: $e');
    }
  }

  // ==================== DOG PROFILES COLLECTION ====================

  /// Save dog profile
  Future<String> saveDogProfile({
    required String shelterId,
    required String name,
    required String breed,
    required Map<String, dynamic> dogData,
  }) async {
    try {
      final docRef = await _firestore.collection('dogs').add({
        'name': name,
        'breed': breed,
        'shelterId': shelterId,
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
        ...dogData,
      });
      return docRef.id;
    } catch (e) {
      throw Exception('Error saving dog profile: $e');
    }
  }

  /// Get dog profile
  Future<DocumentSnapshot> getDogProfile(String dogId) async {
    try {
      return await _firestore.collection('dogs').doc(dogId).get();
    } catch (e) {
      throw Exception('Error getting dog profile: $e');
    }
  }

  /// Get all dogs
  Future<QuerySnapshot> getAllDogs() async {
    try {
      return await _firestore.collection('dogs').get();
    } catch (e) {
      throw Exception('Error getting all dogs: $e');
    }
  }

  /// Get dogs by shelter
  Future<QuerySnapshot> getDogsByShelterId(String shelterId) async {
    try {
      return await _firestore
          .collection('dogs')
          .where('shelterId', isEqualTo: shelterId)
          .get();
    } catch (e) {
      throw Exception('Error getting dogs by shelter: $e');
    }
  }

  /// Update dog profile
  Future<void> updateDogProfile(String dogId, Map<String, dynamic> data) async {
    try {
      await _firestore.collection('dogs').doc(dogId).update({
        ...data,
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      throw Exception('Error updating dog profile: $e');
    }
  }

  // ==================== ADOPTION APPLICATIONS ====================

  /// Save adoption application
  Future<String> saveAdoptionApplication({
    required String userId,
    required String dogId,
    required Map<String, dynamic> applicationData,
  }) async {
    try {
      final docRef = await _firestore.collection('applications').add({
        'userId': userId,
        'dogId': dogId,
        'status': 'pending', // pending, approved, rejected
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
        ...applicationData,
      });
      return docRef.id;
    } catch (e) {
      throw Exception('Error saving adoption application: $e');
    }
  }

  /// Get user applications
  Future<QuerySnapshot> getUserApplications(String userId) async {
    try {
      return await _firestore
          .collection('applications')
          .where('userId', isEqualTo: userId)
          .get();
    } catch (e) {
      throw Exception('Error getting user applications: $e');
    }
  }

  /// Get applications for dog
  Future<QuerySnapshot> getApplicationsForDog(String dogId) async {
    try {
      return await _firestore
          .collection('applications')
          .where('dogId', isEqualTo: dogId)
          .get();
    } catch (e) {
      throw Exception('Error getting applications for dog: $e');
    }
  }

  /// Update application status
  Future<void> updateApplicationStatus(
    String applicationId,
    String status,
  ) async {
    try {
      await _firestore.collection('applications').doc(applicationId).update({
        'status': status,
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      throw Exception('Error updating application status: $e');
    }
  }

  // ==================== FAVORITES ====================

  /// Add dog to user's favorites
  Future<void> addFavorite(String userId, String dogId) async {
    try {
      await _firestore.collection('users').doc(userId).update({
        'favorites': FieldValue.arrayUnion([dogId]),
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      throw Exception('Error adding favorite: $e');
    }
  }

  /// Remove dog from favorites
  Future<void> removeFavorite(String userId, String dogId) async {
    try {
      await _firestore.collection('users').doc(userId).update({
        'favorites': FieldValue.arrayRemove([dogId]),
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      throw Exception('Error removing favorite: $e');
    }
  }

  /// Get user favorites
  Future<List<String>> getUserFavorites(String userId) async {
    try {
      final doc = await _firestore.collection('users').doc(userId).get();
      final data = doc.data();
      return List<String>.from(data?['favorites'] ?? []);
    } catch (e) {
      throw Exception('Error getting user favorites: $e');
    }
  }

  // ==================== SHELTERS ====================

  /// Save shelter profile
  Future<String> saveShelterProfile({
    required String name,
    required Map<String, dynamic> shelterData,
  }) async {
    try {
      final docRef = await _firestore.collection('shelters').add({
        'name': name,
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
        ...shelterData,
      });
      return docRef.id;
    } catch (e) {
      throw Exception('Error saving shelter profile: $e');
    }
  }

  /// Get shelter profile
  Future<DocumentSnapshot> getShelterProfile(String shelterId) async {
    try {
      return await _firestore.collection('shelters').doc(shelterId).get();
    } catch (e) {
      throw Exception('Error getting shelter profile: $e');
    }
  }

  /// Get all shelters
  Future<QuerySnapshot> getAllShelters() async {
    try {
      return await _firestore.collection('shelters').get();
    } catch (e) {
      throw Exception('Error getting all shelters: $e');
    }
  }

  // ==================== MATCHES (AI Results) ====================

  /// Save AI match result
  Future<void> saveMatch({
    required String userId,
    required String dogId,
    required double compatibilityScore,
    required Map<String, dynamic> breakdown,
  }) async {
    try {
      await _firestore.collection('matches').add({
        'userId': userId,
        'dogId': dogId,
        'compatibilityScore': compatibilityScore,
        'breakdown': breakdown,
        'createdAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      throw Exception('Error saving match: $e');
    }
  }

  /// Get matches for user
  Future<QuerySnapshot> getUserMatches(String userId) async {
    try {
      return await _firestore
          .collection('matches')
          .where('userId', isEqualTo: userId)
          .orderBy('compatibilityScore', descending: true)
          .get();
    } catch (e) {
      throw Exception('Error getting user matches: $e');
    }
  }
}
