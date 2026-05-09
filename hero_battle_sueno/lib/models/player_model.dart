class PlayerModel {
  final int? id;
  String name;
  int wins;
  int losses;

  PlayerModel({this.id, required this.name, this.wins = 0, this.losses = 0});

  double get winRate {
    final total = wins + losses;
    if (total == 0) return 0;
    return (wins / total) * 100;
  }

  Map<String, dynamic> toMap() {
    return {'id': id, 'name': name, 'wins': wins, 'losses': losses};
  }

  factory PlayerModel.fromMap(Map<String, dynamic> map) {
    return PlayerModel(
      id: map['id'],
      name: map['name'],
      wins: map['wins'] ?? 0,
      losses: map['losses'] ?? 0,
    );
  }
}
