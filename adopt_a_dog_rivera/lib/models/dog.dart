import 'package:cloud_firestore/cloud_firestore.dart';

/// Dog model with comprehensive adoption platform data
class Dog {
  final String? id; // Firestore document ID
  final String name;
  final String breed;
  final List<String> subBreeds;
  final int? age; // in months
  final String? description;
  final List<String> imageUrls; // From Firebase Storage
  final String? shelterId;
  final String energyLevel; // low, medium, high
  final String maintenanceLevel; // low, medium, high
  final String healthStatus; // healthy, special-needs, recovering, etc.
  final List<String> vaccinations; // e.g., ['rabies', 'distemper']
  final String? gender; // male, female
  final double? weight; // in kg
  final String? color;
  final List<String> behaviors; // e.g., ['friendly', 'playful', 'protective']
  final bool adoptionPending; // Whether dog is in pending adoption
  final DateTime? adoptedAt;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final bool? isAvailable;
  
  // NEW FIELDS
  final double? breedPercentage; // 0-100, purity of breed
  final List<String> characteristics; // e.g., ['friendly', 'intelligent', 'active']
  final String? origin; // Country or region of origin
  final int? popularity; // 1-100, how popular the breed is
  final double? compatibilityScore; // 0-100, based on user preferences
  final Map<String, dynamic>? compatibilityBreakdown; // detailed compatibility analysis

  Dog({
    this.id,
    required this.name,
    required this.breed,
    this.subBreeds = const [],
    this.age,
    this.description,
    this.imageUrls = const [],
    this.shelterId,
    this.energyLevel = 'medium',
    this.maintenanceLevel = 'medium',
    this.healthStatus = 'healthy',
    this.vaccinations = const [],
    this.gender,
    this.weight,
    this.color,
    this.behaviors = const [],
    this.adoptionPending = false,
    this.adoptedAt,
    this.createdAt,
    this.updatedAt,
    this.isAvailable = true,
    this.breedPercentage = 100.0,
    this.characteristics = const [],
    this.origin,
    this.popularity = 50,
    this.compatibilityScore,
    this.compatibilityBreakdown,
  });

  /// Convert to Firestore document
  Map<String, dynamic> toFirestore() {
    return {
      'name': name,
      'breed': breed,
      'subBreeds': subBreeds,
      'age': age,
      'description': description,
      'imageUrls': imageUrls,
      'shelterId': shelterId,
      'energyLevel': energyLevel,
      'maintenanceLevel': maintenanceLevel,
      'healthStatus': healthStatus,
      'vaccinations': vaccinations,
      'gender': gender,
      'weight': weight,
      'color': color,
      'behaviors': behaviors,
      'adoptionPending': adoptionPending,
      'adoptedAt': adoptedAt,
      'isAvailable': isAvailable,
      'breedPercentage': breedPercentage,
      'characteristics': characteristics,
      'origin': origin,
      'popularity': popularity,
      'createdAt': createdAt ?? FieldValue.serverTimestamp(),
      'updatedAt': updatedAt ?? FieldValue.serverTimestamp(),
    };
  }

  /// Create from Firestore document
  factory Dog.fromFirestore(
    DocumentSnapshot<Map<String, dynamic>> doc,
  ) {
    final data = doc.data()!;
    return Dog(
      id: doc.id,
      name: data['name'] as String? ?? 'Unknown',
      breed: data['breed'] as String? ?? 'Unknown',
      subBreeds: List<String>.from(data['subBreeds'] as List? ?? []),
      age: data['age'] as int?,
      description: data['description'] as String?,
      imageUrls: List<String>.from(data['imageUrls'] as List? ?? []),
      shelterId: data['shelterId'] as String?,
      energyLevel: data['energyLevel'] as String? ?? 'medium',
      maintenanceLevel: data['maintenanceLevel'] as String? ?? 'medium',
      healthStatus: data['healthStatus'] as String? ?? 'healthy',
      vaccinations: List<String>.from(data['vaccinations'] as List? ?? []),
      gender: data['gender'] as String?,
      weight: (data['weight'] as num?)?.toDouble(),
      color: data['color'] as String?,
      behaviors: List<String>.from(data['behaviors'] as List? ?? []),
      adoptionPending: data['adoptionPending'] as bool? ?? false,
      adoptedAt: (data['adoptedAt'] as Timestamp?)?.toDate(),
      createdAt: (data['createdAt'] as Timestamp?)?.toDate(),
      updatedAt: (data['updatedAt'] as Timestamp?)?.toDate(),
      isAvailable: data['isAvailable'] as bool? ?? true,
      breedPercentage: (data['breedPercentage'] as num?)?.toDouble() ?? 100.0,
      characteristics: List<String>.from(data['characteristics'] as List? ?? []),
      origin: data['origin'] as String?,
      popularity: data['popularity'] as int? ?? 50,
    );
  }

  /// Create from JSON (for API responses)
  factory Dog.fromJson(Map<String, dynamic> json) {
    return Dog(
      name: json['name'] as String? ?? 'Unknown',
      breed: json['breed'] as String? ?? 'Unknown',
      subBreeds: List<String>.from(json['subBreeds'] as List? ?? []),
      age: json['age'] as int?,
      description: json['description'] as String?,
      imageUrls: List<String>.from(json['imageUrls'] as List? ?? []),
      energyLevel: json['energyLevel'] as String? ?? 'medium',
      maintenanceLevel: json['maintenanceLevel'] as String? ?? 'medium',
      healthStatus: json['healthStatus'] as String? ?? 'healthy',
      vaccinations: List<String>.from(json['vaccinations'] as List? ?? []),
      gender: json['gender'] as String?,
      weight: (json['weight'] as num?)?.toDouble(),
      color: json['color'] as String?,
      behaviors: List<String>.from(json['behaviors'] as List? ?? []),
      isAvailable: json['isAvailable'] as bool? ?? true,
    );
  }

  /// Get display name
  String displayName() {
    return '${name[0].toUpperCase()}${name.substring(1)}';
  }

  /// Get age display string
  String getAgeDisplay() {
    if (age == null) return 'Age unknown';
    final years = age! ~/ 12;
    final months = age! % 12;
    if (years == 0) return '$months months old';
    if (months == 0) return '$years year${years > 1 ? 's' : ''} old';
    return '$years year${years > 1 ? 's' : ''} and $months months old';
  }

  /// Get primary image URL
  String? getPrimaryImageUrl() {
    return imageUrls.isNotEmpty ? imageUrls.first : null;
  }

  /// Check if dog needs special care
  bool hasSpecialNeeds() {
    return healthStatus != 'healthy' || behaviors.any((b) => b.contains('special'));
  }

  /// Get adoption readiness score (0-100)
  int getAdoptionReadiness() {
    int score = 100;
    if (adoptionPending) score -= 30;
    if (!isAvailable!) score -= 50;
    if (hasSpecialNeeds()) score -= 15;
    return score.clamp(0, 100);
  }

  /// Copy with modifications
  Dog copyWith({
    String? id,
    String? name,
    String? breed,
    List<String>? subBreeds,
    int? age,
    String? description,
    List<String>? imageUrls,
    String? shelterId,
    String? energyLevel,
    String? maintenanceLevel,
    String? healthStatus,
    List<String>? vaccinations,
    String? gender,
    double? weight,
    String? color,
    List<String>? behaviors,
    bool? adoptionPending,
    DateTime? adoptedAt,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isAvailable,
  }) {
    return Dog(
      id: id ?? this.id,
      name: name ?? this.name,
      breed: breed ?? this.breed,
      subBreeds: subBreeds ?? this.subBreeds,
      age: age ?? this.age,
      description: description ?? this.description,
      imageUrls: imageUrls ?? this.imageUrls,
      shelterId: shelterId ?? this.shelterId,
      energyLevel: energyLevel ?? this.energyLevel,
      maintenanceLevel: maintenanceLevel ?? this.maintenanceLevel,
      healthStatus: healthStatus ?? this.healthStatus,
      vaccinations: vaccinations ?? this.vaccinations,
      gender: gender ?? this.gender,
      weight: weight ?? this.weight,
      color: color ?? this.color,
      behaviors: behaviors ?? this.behaviors,
      adoptionPending: adoptionPending ?? this.adoptionPending,
      adoptedAt: adoptedAt ?? this.adoptedAt,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isAvailable: isAvailable ?? this.isAvailable,
    );
  }

  @override
  String toString() => 'Dog(id: $id, name: $name, breed: $breed)';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Dog &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name;

  @override
  int get hashCode => id.hashCode ^ name.hashCode;
}
