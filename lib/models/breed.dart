class Breed {
  final String name;
  final List<String> subBreeds;

  const Breed({required this.name, required this.subBreeds});

  String displayName({String? sub}) => sub != null ? "$sub $name" : name;

  /// Dog CEO image endpoints use `breed/<breed>` and `breed/<breed>/<subBreed>`.
  String apiPath({String? sub}) =>
      sub != null ? 'breed/$name/$sub' : 'breed/$name';
}
