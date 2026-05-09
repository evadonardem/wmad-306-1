import 'dart:convert';

class DeckModel {
  int? id;
  int playerId;
  String name;
  List<String> heroes;

  DeckModel({
    this.id,
    required this.playerId,
    required this.name,
    required this.heroes,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'player_id': playerId,
      'name': name,
      'heroes': jsonEncode(heroes),
    };
  }

  factory DeckModel.fromMap(Map<String, dynamic> map) {
    return DeckModel(
      id: map['id'],
      playerId: map['player_id'],
      name: map['name'],
      heroes: List<String>.from(jsonDecode(map['heroes'])),
    );
  }
}
