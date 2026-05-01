class Breed {
  final String name;
  final List<String> subBreeds;

  const Breed({required this.name, required this.subBreeds});

  String displayName({String? sub}) {
    return sub != null
        ? '${_toSentenceCase(sub)} ${_toSentenceCase(name)}'
        : _toSentenceCase(name);
  }

  String _toSentenceCase(String value) {
    if (value.isEmpty) {
      return value;
    }

    return value[0].toUpperCase() + value.substring(1).toLowerCase();
  }
}
