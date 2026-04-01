class Breed {
  final String name;
  final List<String> subBreeds;

  const Breed({required this.name, required this.subBreeds});

  // Display name with optional sub-breed
  String displayName([String? sub]) => sub != null ? '$sub $name' : name;
}
