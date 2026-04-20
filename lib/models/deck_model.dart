import 'hero_model.dart';

class DeckModel {
  final int id;
  final String name;
  final List<HeroModel> heroes;

  DeckModel({required this.id, required this.name, required this.heroes});

  factory DeckModel.fromJson(Map<String, dynamic> json) {
    return DeckModel(
      id: json['id'],
      name: json['name'],
      heroes: (json['heroes'] as List)
          .map((e) => HeroModel.fromJson(e))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'heroes': heroes.map((e) => e.toJson()).toList(),
  };
}
