import 'package:cloud_firestore/cloud_firestore.dart';

/// Adopter profile with preferences and experience
class AdopterProfile {
  final String? id;
  final String userId;
  final String name;
  final String? bio;
  final String? livingType; // apartment, house, farm, etc.
  final int? householdSize;
  final List<String> householdMembers; // children, elderly, pets, etc.
  final String? experience; // beginner, intermediate, experienced
  final List<String> interests; // friendly, active, calm, etc.
  final List<String> preferredBreeds;
  final String? preferredEnergyLevel; // low, medium, high
  final String? preferredSize; // small, medium, large
  final int? minimumAge; // in months
  final int? maximumAge; // in months
  final bool hasPets;
  final int? numberOfPets;
  final List<String> petsTypes; // cat, dog, bird, etc.
  final bool hasYard;
  final bool canTravel;
  final String? phoneNumber;
  final String? preferredContactMethod;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final bool profileComplete;

  AdopterProfile({
    this.id,
    required this.userId,
    required this.name,
    this.bio,
    this.livingType,
    this.householdSize,
    this.householdMembers = const [],
    this.experience = 'intermediate',
    this.interests = const [],
    this.preferredBreeds = const [],
    this.preferredEnergyLevel,
    this.preferredSize,
    this.minimumAge,
    this.maximumAge,
    this.hasPets = false,
    this.numberOfPets = 0,
    this.petsTypes = const [],
    this.hasYard = false,
    this.canTravel = true,
    this.phoneNumber,
    this.preferredContactMethod = 'email',
    this.createdAt,
    this.updatedAt,
    this.profileComplete = false,
  });

  /// Convert to Firestore document
  Map<String, dynamic> toFirestore() {
    return {
      'userId': userId,
      'name': name,
      'bio': bio,
      'livingType': livingType,
      'householdSize': householdSize,
      'householdMembers': householdMembers,
      'experience': experience,
      'interests': interests,
      'preferredBreeds': preferredBreeds,
      'preferredEnergyLevel': preferredEnergyLevel,
      'preferredSize': preferredSize,
      'minimumAge': minimumAge,
      'maximumAge': maximumAge,
      'hasPets': hasPets,
      'numberOfPets': numberOfPets,
      'petsTypes': petsTypes,
      'hasYard': hasYard,
      'canTravel': canTravel,
      'phoneNumber': phoneNumber,
      'preferredContactMethod': preferredContactMethod,
      'profileComplete': profileComplete,
      'createdAt': createdAt ?? FieldValue.serverTimestamp(),
      'updatedAt': updatedAt ?? FieldValue.serverTimestamp(),
    };
  }

  /// Create from Firestore document
  factory AdopterProfile.fromFirestore(
    DocumentSnapshot<Map<String, dynamic>> doc,
  ) {
    final data = doc.data()!;
    return AdopterProfile(
      id: doc.id,
      userId: data['userId'] as String? ?? '',
      name: data['name'] as String? ?? 'User',
      bio: data['bio'] as String?,
      livingType: data['livingType'] as String?,
      householdSize: data['householdSize'] as int?,
      householdMembers:
          List<String>.from(data['householdMembers'] as List? ?? []),
      experience: data['experience'] as String? ?? 'intermediate',
      interests: List<String>.from(data['interests'] as List? ?? []),
      preferredBreeds: List<String>.from(data['preferredBreeds'] as List? ?? []),
      preferredEnergyLevel: data['preferredEnergyLevel'] as String?,
      preferredSize: data['preferredSize'] as String?,
      minimumAge: data['minimumAge'] as int?,
      maximumAge: data['maximumAge'] as int?,
      hasPets: data['hasPets'] as bool? ?? false,
      numberOfPets: data['numberOfPets'] as int? ?? 0,
      petsTypes: List<String>.from(data['petsTypes'] as List? ?? []),
      hasYard: data['hasYard'] as bool? ?? false,
      canTravel: data['canTravel'] as bool? ?? true,
      phoneNumber: data['phoneNumber'] as String?,
      preferredContactMethod: data['preferredContactMethod'] as String?,
      createdAt: (data['createdAt'] as Timestamp?)?.toDate(),
      updatedAt: (data['updatedAt'] as Timestamp?)?.toDate(),
      profileComplete: data['profileComplete'] as bool? ?? false,
    );
  }

  /// Create a copy with updated values
  AdopterProfile copyWith({
    String? bio,
    String? livingType,
    int? householdSize,
    List<String>? householdMembers,
    String? experience,
    List<String>? interests,
    List<String>? preferredBreeds,
    String? preferredEnergyLevel,
    String? preferredSize,
    int? minimumAge,
    int? maximumAge,
    bool? hasPets,
    int? numberOfPets,
    List<String>? petsTypes,
    bool? hasYard,
    bool? canTravel,
    String? phoneNumber,
    String? preferredContactMethod,
    bool? profileComplete,
  }) {
    return AdopterProfile(
      id: id,
      userId: userId,
      name: name,
      bio: bio ?? this.bio,
      livingType: livingType ?? this.livingType,
      householdSize: householdSize ?? this.householdSize,
      householdMembers: householdMembers ?? this.householdMembers,
      experience: experience ?? this.experience,
      interests: interests ?? this.interests,
      preferredBreeds: preferredBreeds ?? this.preferredBreeds,
      preferredEnergyLevel: preferredEnergyLevel ?? this.preferredEnergyLevel,
      preferredSize: preferredSize ?? this.preferredSize,
      minimumAge: minimumAge ?? this.minimumAge,
      maximumAge: maximumAge ?? this.maximumAge,
      hasPets: hasPets ?? this.hasPets,
      numberOfPets: numberOfPets ?? this.numberOfPets,
      petsTypes: petsTypes ?? this.petsTypes,
      hasYard: hasYard ?? this.hasYard,
      canTravel: canTravel ?? this.canTravel,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      preferredContactMethod:
          preferredContactMethod ?? this.preferredContactMethod,
      profileComplete: profileComplete ?? this.profileComplete,
    );
  }
}
