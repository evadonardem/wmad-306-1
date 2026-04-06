import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/saved_dog.dart';

/// Service for managing saved/favorite dogs in Firestore
class SavedDogService {
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// Add a dog to saved/favorites
  static Future<void> saveDog({
    required String userId,
    required String dogId,
    required String dogName,
    required String dogBreed,
    String? dogImageUrl,
    String? notes,
    List<String> tags = const [],
  }) async {
    try {
      final savedDog = SavedDog(
        id: _firestore.collection('users').doc(userId).collection('savedDogs').doc().id,
        userId: userId,
        dogId: dogId,
        dogName: dogName,
        dogBreed: dogBreed,
        dogImageUrl: dogImageUrl,
        notes: notes,
        tags: tags,
      );

      await _firestore
          .collection('users')
          .doc(userId)
          .collection('savedDogs')
          .doc(savedDog.id)
          .set(savedDog.toFirestore());

      print('SavedDogService: Dog saved successfully: $dogId');
    } catch (e) {
      throw Exception('Failed to save dog: $e');
    }
  }

  /// Remove a dog from saved/favorites
  static Future<void> removeSavedDog(String userId, String savedDogId) async {
    try {
      await _firestore
          .collection('users')
          .doc(userId)
          .collection('savedDogs')
          .doc(savedDogId)
          .delete();

      print('SavedDogService: Dog removed from favorites: $savedDogId');
    } catch (e) {
      throw Exception('Failed to remove saved dog: $e');
    }
  }

  /// Get all saved dogs for a user
  static Future<List<SavedDog>> getSavedDogs(String userId) async {
    try {
      final snapshot = await _firestore
          .collection('users')
          .doc(userId)
          .collection('savedDogs')
          .orderBy('savedAt', descending: true)
          .get();

      return snapshot.docs
          .map((doc) => SavedDog.fromFirestore(doc))
          .toList();
    } catch (e) {
      throw Exception('Failed to get saved dogs: $e');
    }
  }

  /// Get saved dogs as a stream
  static Stream<List<SavedDog>> getSavedDogsStream(String userId) {
    return _firestore
        .collection('users')
        .doc(userId)
        .collection('savedDogs')
        .orderBy('savedAt', descending: true)
        .snapshots()
        .map((snapshot) =>
            snapshot.docs
                .map((doc) => SavedDog.fromFirestore(doc))
                .toList());
  }

  /// Check if a dog is saved
  static Future<bool> isDogSaved(String userId, String dogId) async {
    try {
      final snapshot = await _firestore
          .collection('users')
          .doc(userId)
          .collection('savedDogs')
          .where('dogId', isEqualTo: dogId)
          .limit(1)
          .get();

      return snapshot.docs.isNotEmpty;
    } catch (e) {
      throw Exception('Failed to check if dog is saved: $e');
    }
  }

  /// Update notes for a saved dog
  static Future<void> updateNotes(
      String userId, String savedDogId, String notes) async {
    try {
      await _firestore
          .collection('users')
          .doc(userId)
          .collection('savedDogs')
          .doc(savedDogId)
          .update({'notes': notes});

      print('SavedDogService: Notes updated for: $savedDogId');
    } catch (e) {
      throw Exception('Failed to update notes: $e');
    }
  }

  /// Add a tag to a saved dog
  static Future<void> addTag(
      String userId, String savedDogId, String tag) async {
    try {
      await _firestore
          .collection('users')
          .doc(userId)
          .collection('savedDogs')
          .doc(savedDogId)
          .update({
        'tags': FieldValue.arrayUnion([tag]),
      });

      print('SavedDogService: Tag added to: $savedDogId');
    } catch (e) {
      throw Exception('Failed to add tag: $e');
    }
  }

  /// Remove a tag from a saved dog
  static Future<void> removeTag(
      String userId, String savedDogId, String tag) async {
    try {
      await _firestore
          .collection('users')
          .doc(userId)
          .collection('savedDogs')
          .doc(savedDogId)
          .update({
        'tags': FieldValue.arrayRemove([tag]),
      });

      print('SavedDogService: Tag removed from: $savedDogId');
    } catch (e) {
      throw Exception('Failed to remove tag: $e');
    }
  }
}
