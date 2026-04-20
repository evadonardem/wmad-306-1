import 'package:dio/dio.dart';
import '../models/hero_model.dart';
import '../models/power_stats.dart';

/// Service for interacting with the Superhero API
class SuperheroApiService {
  /// Fetch a curated list of famous superheroes (by ID)
  static Future<List<HeroModel>> fetchFamousHeroes() async {
    // API heroes
    final famousIds = [
      70, // Batman
      644, // Superman
      659, // Thor
      346, // Iron Man
      149, // Captain America
      720, // Wolverine
      332, // Hulk
      717, // Wonder Woman
      263, // Flash
      620, // Spider-Man
      106, // Cyclops
      687, // Vision
      213, // Doctor Strange
      298, // Green Lantern
      204, // Deadpool
      165, // Daredevil
      579, // Silver Surfer
      297, // Green Arrow
      107, // Daredevil
    ];
    final apiHeroes = await Future.wait(famousIds.map(fetchHeroById));

    // Custom anime heroes
    final animeHeroes = <HeroModel>[
      HeroModel(
        id: '9001',
        name: 'Monkey D. Luffy',
        imageUrl:
            'https://static.wikia.nocookie.net/onepiece/images/6/6f/Monkey_D._Luffy_Anime_Pre_Timeskip_Infobox.png',
        powerStats: PowerStats(
          intelligence: 70,
          strength: 95,
          speed: 85,
          durability: 90,
          power: 98,
          combat: 92,
          powerPercent: 92.0,
          details: 'Gum-Gum Fruit, Haki, Captain of Straw Hat Pirates',
        ),
        publisher: 'Toei Animation',
        alignment: 'good',
        fullName: 'Monkey D. Luffy',
        origin: 'Anime',
      ),
      HeroModel(
        id: '9002',
        name: 'Roronoa Zoro',
        imageUrl:
            'https://static.wikia.nocookie.net/onepiece/images/8/8e/Roronoa_Zoro_Anime_Pre_Timeskip_Infobox.png',
        powerStats: PowerStats(
          intelligence: 65,
          strength: 93,
          speed: 80,
          durability: 88,
          power: 90,
          combat: 97,
          powerPercent: 89.0,
          details: 'Three Sword Style, Haki, Swordsman of Straw Hat Pirates',
        ),
        publisher: 'Toei Animation',
        alignment: 'good',
        fullName: 'Roronoa Zoro',
        origin: 'Anime',
      ),
      HeroModel(
        id: '9003',
        name: 'Son Goku',
        imageUrl:
            'https://static.wikia.nocookie.net/dragonball/images/0/01/GokuAnime.png',
        powerStats: PowerStats(
          intelligence: 75,
          strength: 100,
          speed: 100,
          durability: 100,
          power: 100,
          combat: 100,
          powerPercent: 100.0,
          details: 'Saiyan, Ultra Instinct, Kamehameha',
        ),
        publisher: 'Toei Animation',
        alignment: 'good',
        fullName: 'Son Goku',
        origin: 'Anime',
      ),
      HeroModel(
        id: '9004',
        name: 'Naruto Uzumaki',
        imageUrl:
            'https://static.wikia.nocookie.net/naruto/images/9/97/Naruto_Uzumaki_Part_II.png',
        powerStats: PowerStats(
          intelligence: 80,
          strength: 85,
          speed: 90,
          durability: 90,
          power: 98,
          combat: 95,
          powerPercent: 95.0,
          details: 'Nine-Tails Jinchuriki, Sage Mode, Hokage',
        ),
        publisher: 'Studio Pierrot',
        alignment: 'good',
        fullName: 'Naruto Uzumaki',
        origin: 'Anime',
      ),
      HeroModel(
        id: '9005',
        name: 'Saitama',
        imageUrl:
            'https://static.wikia.nocookie.net/onepunchman/images/2/22/Saitama_Anime.png',
        powerStats: PowerStats(
          intelligence: 80,
          strength: 100,
          speed: 100,
          durability: 100,
          power: 100,
          combat: 100,
          powerPercent: 100.0,
          details: 'One Punch, Limitless Strength, Hero for Fun',
        ),
        publisher: 'Madhouse',
        alignment: 'good',
        fullName: 'Saitama',
        origin: 'Anime',
      ),
      HeroModel(
        id: '9006',
        name: 'Sailor Moon',
        imageUrl:
            'https://static.wikia.nocookie.net/sailormoon/images/2/2e/Sailor_Moon_Anime.png',
        powerStats: PowerStats(
          intelligence: 70,
          strength: 60,
          speed: 80,
          durability: 75,
          power: 95,
          combat: 70,
          powerPercent: 85.0,
          details: 'Moon Prism Power, Magic, Sailor Senshi',
        ),
        publisher: 'Toei Animation',
        alignment: 'good',
        fullName: 'Usagi Tsukino',
        origin: 'Anime',
      ),
    ];

    // Remove duplicate anime heroes by name or imageUrl
    final uniqueAnimeHeroes = <HeroModel>[];
    final seenNames = <String>{};
    final seenImages = <String>{};
    for (final hero in animeHeroes) {
      if (!seenNames.contains(hero.name) &&
          !seenImages.contains(hero.imageUrl)) {
        uniqueAnimeHeroes.add(hero);
        seenNames.add(hero.name);
        seenImages.add(hero.imageUrl);
      }
    }
    return [...apiHeroes.whereType<HeroModel>(), ...uniqueAnimeHeroes];
  }

  static final Dio _dio = Dio();
  static const String _baseUrl = 'https://superheroapi.com/api.php/';
  static const String _token = '8998fee29dc9c9d5136172719771d42e';

  /// Fetch a hero by ID from the Superhero API
  static Future<HeroModel?> fetchHeroById(int id) async {
    try {
      final response = await _dio.get('$_baseUrl$_token/$id');
      if (response.statusCode == 200 && response.data != null) {
        return HeroModel.fromJson(response.data);
      }
    } catch (e) {
      print('Error fetching hero by ID: $e');
    }
    return null;
  }

  /// Search heroes by name from the Superhero API
  static Future<List<HeroModel>> searchHeroesByName(String name) async {
    try {
      final response = await _dio.get('$_baseUrl$_token/search/$name');
      if (response.statusCode == 200 && response.data['results'] != null) {
        return (response.data['results'] as List)
            .map((e) => HeroModel.fromJson(e))
            .toList();
      }
    } catch (e) {
      print('Error searching heroes: $e');
    }
    return [];
  }

  /// Fetch a random selection of heroes (IDs 1-731)
  static Future<List<HeroModel>> fetchRandomHeroes({int count = 20}) async {
    final ids = List.generate(731, (i) => i + 1)..shuffle();
    final futures = ids.take(count).map(fetchHeroById);
    final heroes = await Future.wait(futures);
    return heroes.whereType<HeroModel>().toList();
  }
}
