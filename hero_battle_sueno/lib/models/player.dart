class Player {
  int? id;
  String name;
  int wins;
  int losses;
  List<Map<String, dynamic>> decks;
  List<Map<String, dynamic>> history;

  Player({
    this.id,
    required this.name,
    this.wins = 0,
    this.losses = 0,
    List<Map<String, dynamic>>? decks,
    List<Map<String, dynamic>>? history,
  }) : decks = decks ?? [],
       history = history ?? [];

  double get winRate {
    int total = wins + losses;
    if (total == 0) return 0;
    return (wins / total) * 100;
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'wins': wins,
      'losses': losses,
      'decks': decks,
      'history': history,
    };
  }

  factory Player.fromJson(Map<String, dynamic> json) {
    return Player(
      id: json['id'],
      name: json['name'],
      wins: json['wins'] ?? 0,
      losses: json['losses'] ?? 0,
      decks: List<Map<String, dynamic>>.from(json['decks'] ?? []),
      history: List<Map<String, dynamic>>.from(json['history'] ?? []),
    );
  }
}
