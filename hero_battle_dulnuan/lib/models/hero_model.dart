class HeroModel {
  final String name;
  final String imageUrl;
  final String power;
  final String intelligence;
  final String speed;

  HeroModel({
    required this.name,
    required this.imageUrl,
    required this.power,
    required this.intelligence,
    required this.speed,
  });

  factory HeroModel.fromJson(Map<String, dynamic> json) {
    return HeroModel(
      name: json["name"] ?? "Unknown",
      imageUrl: json["image"]["url"] ?? "",
      power: json["powerstats"]["power"] ?? "0",
      intelligence: json["powerstats"]["intelligence"] ?? "0",
      speed: json["powerstats"]["speed"] ?? "0",
    );
  }
}