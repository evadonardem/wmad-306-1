class Breed {
  final String name;
  final List<String> subBreeds;

  const Breed({required this.name, required this.subBreeds});

  String displayName({String? sub}) => sub != null ? "$sub $name" : name;
}
