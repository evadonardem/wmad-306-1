class Deck {
  String name;
  List<String> heroes;

  Deck({required this.name, required this.heroes});

  Map<String, dynamic> toJson() => {'name': name, 'heroes': heroes};

  factory Deck.fromJson(Map<String, dynamic> json) =>
      Deck(name: json['name'], heroes: List<String>.from(json['heroes'] ?? []));
}
