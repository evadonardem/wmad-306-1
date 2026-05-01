import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/dog.dart';

class DogManagementService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// Create a new dog listing
  Future<String> createDog({
    required String shelterId,
    required Dog dog,
  }) async {
    try {
      final docRef = await _firestore.collection('dogs').add(
        dog.copyWith(shelterId: shelterId).toFirestore(),
      );
      return docRef.id;
    } catch (e) {
      throw Exception('Error creating dog listing: $e');
    }
  }

  /// Get dog by ID
  Future<Dog?> getDog(String dogId) async {
    try {
      final doc = await _firestore.collection('dogs').doc(dogId).get();
      if (!doc.exists) return null;
      return Dog.fromFirestore(doc);
    } catch (e) {
      throw Exception('Error getting dog: $e');
    }
  }

  /// Get all dogs
  Future<List<Dog>> getAllDogs() async {
    try {
      final querySnapshot = await _firestore
          .collection('dogs')
          .where('isAvailable', isEqualTo: true)
          .where('adoptionPending', isEqualTo: false)
          .get();

      return querySnapshot.docs
          .map((doc) => Dog.fromFirestore(
              doc as DocumentSnapshot<Map<String, dynamic>>))
          .toList();
    } catch (e) {
      throw Exception('Error getting all dogs: $e');
    }
  }

  /// Get dogs by shelter
  Future<List<Dog>> getDogsByShelterId(String shelterId) async {
    try {
      final querySnapshot = await _firestore
          .collection('dogs')
          .where('shelterId', isEqualTo: shelterId)
          .get();

      return querySnapshot.docs
          .map((doc) => Dog.fromFirestore(
              doc as DocumentSnapshot<Map<String, dynamic>>))
          .toList();
    } catch (e) {
      throw Exception('Error getting dogs by shelter: $e');
    }
  }

  /// Get dogs by breed
  Future<List<Dog>> getDogsByBreed(String breed) async {
    try {
      final querySnapshot = await _firestore
          .collection('dogs')
          .where('breed', isEqualTo: breed)
          .where('isAvailable', isEqualTo: true)
          .get();

      return querySnapshot.docs
          .map((doc) => Dog.fromFirestore(
              doc as DocumentSnapshot<Map<String, dynamic>>))
          .toList();
    } catch (e) {
      throw Exception('Error getting dogs by breed: $e');
    }
  }

  /// Get dogs by energy level
  Future<List<Dog>> getDogsByEnergyLevel(String energyLevel) async {
    try {
      final querySnapshot = await _firestore
          .collection('dogs')
          .where('energyLevel', isEqualTo: energyLevel)
          .where('isAvailable', isEqualTo: true)
          .get();

      return querySnapshot.docs
          .map((doc) => Dog.fromFirestore(
              doc as DocumentSnapshot<Map<String, dynamic>>))
          .toList();
    } catch (e) {
      throw Exception('Error getting dogs by energy level: $e');
    }
  }

  /// Get special needs dogs
  Future<List<Dog>> getSpecialNeedsDogs() async {
    try {
      final querySnapshot = await _firestore
          .collection('dogs')
          .where('healthStatus', isNotEqualTo: 'healthy')
          .where('isAvailable', isEqualTo: true)
          .get();

      return querySnapshot.docs
          .map((doc) => Dog.fromFirestore(
              doc as DocumentSnapshot<Map<String, dynamic>>))
          .toList();
    } catch (e) {
      throw Exception('Error getting special needs dogs: $e');
    }
  }

  /// Update dog listing
  Future<void> updateDog(String dogId, Dog dog) async {
    try {
      await _firestore.collection('dogs').doc(dogId).update(
        dog.copyWith(id: dogId).toFirestore(),
      );
    } catch (e) {
      throw Exception('Error updating dog: $e');
    }
  }

  /// Add image URL to dog
  Future<void> addImageToDog(String dogId, String imageUrl) async {
    try {
      await _firestore.collection('dogs').doc(dogId).update({
        'imageUrls': FieldValue.arrayUnion([imageUrl]),
      });
    } catch (e) {
      throw Exception('Error adding image to dog: $e');
    }
  }

  /// Remove image URL from dog
  Future<void> removeImageFromDog(String dogId, String imageUrl) async {
    try {
      await _firestore.collection('dogs').doc(dogId).update({
        'imageUrls': FieldValue.arrayRemove([imageUrl]),
      });
    } catch (e) {
      throw Exception('Error removing image from dog: $e');
    }
  }

  /// Mark dog as adopted
  Future<void> markDogAsAdopted(String dogId) async {
    try {
      await _firestore.collection('dogs').doc(dogId).update({
        'isAvailable': false,
        'adoptedAt': FieldValue.serverTimestamp(),
        'adoptionPending': false,
      });
    } catch (e) {
      throw Exception('Error marking dog as adopted: $e');
    }
  }

  /// Mark dog as adoption pending
  Future<void> markDogAsAdoptionPending(String dogId) async {
    try {
      await _firestore.collection('dogs').doc(dogId).update({
        'adoptionPending': true,
      });
    } catch (e) {
      throw Exception('Error marking dog adoption pending: $e');
    }
  }

  /// Cancel adoption pending
  Future<void> cancelAdoptionPending(String dogId) async {
    try {
      await _firestore.collection('dogs').doc(dogId).update({
        'adoptionPending': false,
      });
    } catch (e) {
      throw Exception('Error canceling adoption pending: $e');
    }
  }

  /// Delete dog listing
  Future<void> deleteDog(String dogId) async {
    try {
      await _firestore.collection('dogs').doc(dogId).delete();
    } catch (e) {
      throw Exception('Error deleting dog: $e');
    }
  }

  /// Search dogs by name
  Future<List<Dog>> searchDogsByName(String name) async {
    try {
      final querySnapshot = await _firestore
          .collection('dogs')
          .where('name', isGreaterThanOrEqualTo: name)
          .where('name', isLessThan: '${name}z')
          .where('isAvailable', isEqualTo: true)
          .get();

      return querySnapshot.docs
          .map((doc) => Dog.fromFirestore(
              doc as DocumentSnapshot<Map<String, dynamic>>))
          .toList();
    } catch (e) {
      throw Exception('Error searching dogs: $e');
    }
  }

  /// Get dogs with multiple filters
  Future<List<Dog>> filterDogs({
    String? breed,
    String? energyLevel,
    String? healthStatus,
    int? minAge,
    int? maxAge,
  }) async {
    try {
      Query query = _firestore.collection('dogs')
          .where('isAvailable', isEqualTo: true);

      if (breed != null) {
        query = query.where('breed', isEqualTo: breed);
      }
      if (energyLevel != null) {
        query = query.where('energyLevel', isEqualTo: energyLevel);
      }
      if (healthStatus != null) {
        query = query.where('healthStatus', isEqualTo: healthStatus);
      }

      final querySnapshot = await query.get();

      var results = querySnapshot.docs
          .map((doc) => Dog.fromFirestore(
              doc as DocumentSnapshot<Map<String, dynamic>>))
          .toList();

      // Apply age filtering in memory since Firestore doesn't support range queries well
      if (minAge != null || maxAge != null) {
        results = results.where((dog) {
          if (dog.age == null) return false;
          if (minAge != null && dog.age! < minAge) return false;
          if (maxAge != null && dog.age! > maxAge) return false;
          return true;
        }).toList();
      }

      return results;
    } catch (e) {
      throw Exception('Error filtering dogs: $e');
    }
  }

  /// Get adoption statistics
  Future<Map<String, dynamic>> getAdoptionStats(String shelterId) async {
    try {
      final allDogs =
          await _firestore.collection('dogs')
              .where('shelterId', isEqualTo: shelterId)
              .get();

      final availableDogs = allDogs.docs
          .where((doc) => doc['isAvailable'] == true)
          .length;

      final adoptedDogs = allDogs.docs
          .where((doc) => doc['isAvailable'] == false)
          .length;

      final pendingDogs = allDogs.docs
          .where((doc) => doc['adoptionPending'] == true)
          .length;

      return {
        'total': allDogs.size,
        'available': availableDogs,
        'adopted': adoptedDogs,
        'pending': pendingDogs,
      };
    } catch (e) {
      throw Exception('Error getting adoption stats: $e');
    }
  }

  /// Watch dogs in real-time (for UI updates)
  Stream<List<Dog>> watchDogs() {
    return _firestore
        .collection('dogs')
        .where('isAvailable', isEqualTo: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => Dog.fromFirestore(
              doc as DocumentSnapshot<Map<String, dynamic>>))
          .toList();
    });
  }

  /// Watch specific dog in real-time
  Stream<Dog?> watchDog(String dogId) {
    return _firestore
        .collection('dogs')
        .doc(dogId)
        .snapshots()
        .map((snapshot) {
      if (!snapshot.exists) return null;
      return Dog.fromFirestore(
          snapshot);
    });
  }

  /// Watch dogs by shelter in real-time
  Stream<List<Dog>> watchDogsByShelterId(String shelterId) {
    return _firestore
        .collection('dogs')
        .where('shelterId', isEqualTo: shelterId)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => Dog.fromFirestore(
              doc as DocumentSnapshot<Map<String, dynamic>>))
          .toList();
    });
  }
}
