import 'package:cloud_firestore/cloud_firestore.dart';

/// Model for a dog saved to favorites/saved list
class SavedDog {
  final String id;
  final String userId;
  final String dogId;
  final String dogName;
  final String dogBreed;
  final String? dogImageUrl;
  final DateTime savedAt;
  final String? notes; // User's personal notes about the dog
  final List<String> tags; // Custom tags like 'interested', 'watching', etc.

  SavedDog({
    required this.id,
    required this.userId,
    required this.dogId,
    required this.dogName,
    required this.dogBreed,
    this.dogImageUrl,
    DateTime? savedAt,
    this.notes,
    this.tags = const [],
  }) : savedAt = savedAt ?? DateTime.now();

  /// Convert to Firestore document
  Map<String, dynamic> toFirestore() {
    return {
      'userId': userId,
      'dogId': dogId,
      'dogName': dogName,
      'dogBreed': dogBreed,
      'dogImageUrl': dogImageUrl,
      'savedAt': Timestamp.fromDate(savedAt),
      'notes': notes,
      'tags': tags,
    };
  }

  /// Create from Firestore document
  factory SavedDog.fromFirestore(
    DocumentSnapshot<Map<String, dynamic>> doc,
  ) {
    final data = doc.data()!;
    return SavedDog(
      id: doc.id,
      userId: data['userId'] as String? ?? '',
      dogId: data['dogId'] as String? ?? '',
      dogName: data['dogName'] as String? ?? 'Unknown',
      dogBreed: data['dogBreed'] as String? ?? 'Unknown',
      dogImageUrl: data['dogImageUrl'] as String?,
      savedAt: (data['savedAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      notes: data['notes'] as String?,
      tags: List<String>.from(data['tags'] as List? ?? []),
    );
  }

  /// Create a copy with updated values
  SavedDog copyWith({
    String? notes,
    List<String>? tags,
  }) {
    return SavedDog(
      id: id,
      userId: userId,
      dogId: dogId,
      dogName: dogName,
      dogBreed: dogBreed,
      dogImageUrl: dogImageUrl,
      savedAt: savedAt,
      notes: notes ?? this.notes,
      tags: tags ?? this.tags,
    );
  }
}
