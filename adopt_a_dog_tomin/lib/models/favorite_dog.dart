class FavoriteDog {
  final String breedName;
  final String imageUrl;
  final String? subBreed;

  const FavoriteDog({
    required this.breedName,
    required this.imageUrl,
    this.subBreed,
  });

  String get displayName => subBreed == null
      ? _toSentenceCase(breedName)
      : '${_toSentenceCase(subBreed!)} ${_toSentenceCase(breedName)}';

  Map<String, dynamic> toJson() {
    return {'breedName': breedName, 'imageUrl': imageUrl, 'subBreed': subBreed};
  }

  factory FavoriteDog.fromJson(Map<String, dynamic> json) {
    return FavoriteDog(
      breedName: json['breedName'] as String,
      imageUrl: json['imageUrl'] as String,
      subBreed: json['subBreed'] as String?,
    );
  }

  String _toSentenceCase(String value) {
    if (value.isEmpty) {
      return value;
    }

    return value[0].toUpperCase() + value.substring(1).toLowerCase();
  }
}
