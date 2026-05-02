class HeroSummary {
  final String id;
  final String name;
  final String imageUrl;

  const HeroSummary({
    required this.id,
    required this.name,
    required this.imageUrl,
  });

  factory HeroSummary.fromJson(Map<String, dynamic> json) {
    return HeroSummary(
      id: _asText(json['id']),
      name: _asText(json['name']),
      imageUrl: _extractImageUrl(json),
    );
  }
}

class HeroDetail {
  final String id;
  final String name;
  final String imageUrl;
  final Map<String, String> powerstats;
  final Map<String, String> biography;
  final Map<String, String> appearance;
  final Map<String, String> work;
  final Map<String, String> connections;

  const HeroDetail({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.powerstats,
    required this.biography,
    required this.appearance,
    required this.work,
    required this.connections,
  });

  factory HeroDetail.fromFullJson(Map<String, dynamic> json) {
    return HeroDetail(
      id: _asText(json['id']),
      name: _asText(json['name']),
      imageUrl: _extractImageUrl(json),
      powerstats: _mapToText(json['powerstats']),
      biography: _mapToText(json['biography']),
      appearance: _mapToText(json['appearance']),
      work: _mapToText(json['work']),
      connections: _mapToText(json['connections']),
    );
  }

  HeroDetail copyWith({
    Map<String, String>? powerstats,
    Map<String, String>? biography,
    Map<String, String>? appearance,
    Map<String, String>? work,
    Map<String, String>? connections,
    String? imageUrl,
  }) {
    return HeroDetail(
      id: id,
      name: name,
      imageUrl: imageUrl ?? this.imageUrl,
      powerstats: powerstats ?? this.powerstats,
      biography: biography ?? this.biography,
      appearance: appearance ?? this.appearance,
      work: work ?? this.work,
      connections: connections ?? this.connections,
    );
  }
}

String _extractImageUrl(Map<String, dynamic> json) {
  final imageNode = json['image'];
  if (imageNode is Map<String, dynamic>) {
    final url = _asText(imageNode['url']);
    if (url != 'Unknown') return url;
  }
  if (imageNode is String) {
    final url = _asText(imageNode);
    if (url != 'Unknown') return url;
  }
  return 'Unknown';
}

String _asText(dynamic value) {
  if (value == null) return 'Unknown';
  final text = value.toString().trim();
  if (text.isEmpty || text == 'null' || text == '-') {
    return 'Unknown';
  }
  return text;
}

Map<String, String> _mapToText(dynamic value) {
  if (value is! Map<String, dynamic>) return const <String, String>{};
  return value.map<String, String>((key, val) {
    if (val is List) {
      final joined = val
          .where((item) => item != null && item.toString().trim().isNotEmpty)
          .map((item) => item.toString().trim())
          .join(', ');
      return MapEntry(key, joined.isEmpty ? 'Unknown' : joined);
    }
    return MapEntry(key, _asText(val));
  });
}
