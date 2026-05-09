import 'dart:typed_data';
import 'package:flutter/material.dart';
import '../models/breed.dart';
import '../services/dog_api_service.dart';
import '../services/prefs_service.dart';

class DogProfile {
  final String name;
  final String age;
  final String temperament;
  final String favoriteActivities;
  final String specialTrait;
  final String status;

  const DogProfile({
    required this.name,
    required this.age,
    required this.temperament,
    required this.favoriteActivities,
    required this.specialTrait,
    required this.status,
  });
}

// Removed unused _maxName
const List<String> ages = [
  '8 months',
  '1 year',
  '2 years',
  '3 years',
  '4 years',
  '5 years',
  '6 years',
  '7 years',
  '18 months',
  '2.5 years',
  '3.5 years',
  '4.5 years',
  '5.5 years',
];
const List<String> temperaments = [
  'Calm, confident, gentle',
  'Friendly, playful, loyal',
  'Curious, energetic, affectionate',
  'Sweet, social, curious',
  'Smart, alert, devoted',
  'Easygoing, cuddly, patient',
  'Protective, brave, loving',
  'Goofy, fun-loving, loyal',
  'Gentle, patient, affectionate',
  'Adventurous, clever, spirited',
];
const List<String> favoriteActivities = [
  'Long walks, belly rubs, and quiet naps in the sun',
  'Playing fetch in the park',
  'Chasing butterflies and rolling in grass',
  'Learning new tricks and cuddling',
  'Splashing in puddles and sunbathing',
  'Exploring trails and making new friends',
  'Tug-of-war and hide-and-seek',
  'Watching birds and napping by the window',
  'Digging in the sand and running on the beach',
  'Helping in the garden and snuggling on the couch',
];
const List<String> specialTraits = [
  'Loyal companion who bonds quickly and loves to make people smile',
  'Always ready to cheer you up with a wagging tail',
  'Gentle soul with a heart of gold',
  'Quick learner who loves to please',
  'Expert cuddler and loyal friend',
  'Brave protector and gentle playmate',
  'Makes everyone laugh with silly antics',
  'Loves to greet everyone with a happy dance',
  'Patient listener and devoted buddy',
  'Will be your shadow and best friend',
];
const List<String> statuses = [
  'Ready to shower a forever family with love and devotion',
  'Eager to meet my new best friend',
  'Waiting for a loving home',
  'Excited to join a caring family',
  'Looking for a place to call home',
  'Hoping to find a lifelong companion',
  'Dreaming of adventures with you',
  'Wagging for a second chance',
  'Prepared to give endless love',
  'Can’t wait to make memories together',
];
const List<String> uniqueMessages = [
  '❤️ This dog isn’t just waiting for a home — they’re waiting for someone to be their best friend. Ready to fill your days with joy, loyalty, and endless tail wags!',
  '🐾 Looking for a loyal companion? This pup is ready to fill your life with laughter, love, and adventure!',
  '🌟 Adopt today and discover a friend who will cherish every moment with you!',
  '💖 Open your heart and home to a dog who will be your biggest fan and most loyal pal.',
  '🏡 Every day is brighter with a friend like this—adopt and start your journey together!',
  '🎾 From playtime to snuggles, this dog is ready for a lifetime of memories!',
  '🦴 Give this pup a chance and you’ll gain a loving, devoted companion for life!',
  '☀️ Ready to bring sunshine and smiles to your home—adopt today!',
  '🎉 Make every day special with a dog who’s always happy to see you!',
  '🚀 Start your next adventure with a furry friend who’s all heart!',
];

const List<String> dogNames = [
  'Max',
  'Bella',
  'Charlie',
  'Luna',
  'Rocky',
  'Lucy',
  'Cooper',
  'Daisy',
  'Milo',
  'Sadie',
  'Buddy',
  'Bailey',
  'Bear',
  'Maggie',
  'Duke',
  'Sophie',
  'Teddy',
  'Chloe',
  'Leo',
  'Rosie',
  'Finn',
  'Ruby',
  'Zeus',
  'Nala',
  'Ollie',
  'Hazel',
  'Bruno',
  'Willow',
  'Ace',
  'Penny',
  'Archie',
  'Nova',
  'Jasper',
  'Skye',
  'Benny',
  'Zara',
  'Chase',
  'Maya',
  'Rex',
  'Mocha',
  'Pepper',
  'Scout',
  'Remy',
  'Coco',
  'Winston',
  'Ellie',
  'Murphy',
  'Louie',
  'Harley',
  'Abby',
  'Riley',
  'Gus',
  'Millie',
  'Shadow',
  'Hunter',
  'Phoebe',
  'Simba',
  'Holly',
  'Otis',
  'Maddie',
  'Bentley',
  'Piper',
  'Tank',
  'Lexi',
  'Cash',
  'Belle',
  'Thor',
  'Misty',
  'Rocco',
  'Mimi',
  'Diesel',
  'Minnie',
  'Boomer',
  'Olive',
  'Copper',
  'Mochi',
  'Frankie',
  'Loki',
  'Mabel',
  'Sunny',
  'Chance',
  'Sasha',
  'Blue',
  'Macy',
  'Hank',
  'Izzy',
  'Apollo',
  'Annie',
  'Jackson',
  'Layla',
  'Sam',
  'Josie',
  'Baxter',
  'Cleo',
  'Brady',
  'Ginger',
  'Jake',
  'Lexie',
  'Marley',
  'Rudy',
  'Hazel',
  'Milo',
  'Maggie',
  'Scout',
];

class BreedDetailScreen extends StatefulWidget {
  final Breed breed;
  const BreedDetailScreen({super.key, required this.breed});

  @override
  State<BreedDetailScreen> createState() => BreedDetailScreenState();
}

class BreedDetailScreenState extends State<BreedDetailScreen> {
  late Future<Uint8List> imageFuture;
  final _api = DogApiService();
  final prefs = PrefsService();
  bool saved = false;
  late DogProfile _profile;
  // Removed unused _profileSeed
  int _refreshCount = 0;

  // Example logos per breed (add more as needed)
  static const Map<String, IconData> breedLogos = {
    'airedale': Icons.pets,
    'beagle': Icons.emoji_nature,
    'bulldog': Icons.sports_football,
    'dalmatian': Icons.local_fire_department,
    'poodle': Icons.spa,
    'husky': Icons.ac_unit,
    // fallback
    'default': Icons.favorite,
  };

  // Example color schemes per breed (add more as needed)
  static const Map<String, Color> breedColors = {
    'airedale': Color(0xFFBCAAA4),
    'beagle': Color(0xFFFFE082),
    'bulldog': Color(0xFFB0BEC5),
    'dalmatian': Color(0xFFEEEEEE),
    'poodle': Color(0xFFF8BBD0),
    'husky': Color(0xFF90CAF9),
    // fallback
    'default': Color(0xFFD1C4E9),
  };

  DogProfile _buildProfile() {
    // Generate unique profile fields for each breed and photo refresh
    final breedKey = widget.breed.displayName().toLowerCase();
    final hash =
        breedKey.codeUnits.fold(0, (prev, c) => prev + c) + _refreshCount;
    final name = dogNames[hash % dogNames.length];
    final age = ages[hash % ages.length];
    final temperament = temperaments[hash % temperaments.length];
    final favActs = favoriteActivities[hash % favoriteActivities.length];
    final specialTrait = specialTraits[hash % specialTraits.length];
    final status = statuses[hash % statuses.length];
    return DogProfile(
      name: name,
      age: age,
      temperament: temperament,
      favoriteActivities: favActs,
      specialTrait: specialTrait,
      status: status,
    );
  }

  @override
  void initState() {
    super.initState();
    imageFuture = _api.fetchRandomImageBytes(widget.breed.name);
    _profile = _buildProfile();
    _checkIfFavorite();
  }

  Future<void> _checkIfFavorite() async {
    final favorites = await prefs.loadFavorites();
    setState(() {
      saved = favorites.contains(widget.breed.name);
    });
  }

  void refresh() {
    setState(() {
      _refreshCount++;
      imageFuture = _api.fetchRandomImageBytes(widget.breed.name);
      saved = false;
      _profile = _buildProfile();
    });
  }

  Future<void> toggleFavorite() async {
    if (saved) {
      await prefs.removeFavorite(widget.breed.name);
      await prefs.removeFavoriteImageUrl(widget.breed.name);
      setState(() => saved = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('${widget.breed.name} removed from favorites.')),
        );
      }
    } else {
      final bytes = await imageFuture;
      await prefs.saveFavoriteWithImage(widget.breed.name, bytes);
      setState(() => saved = true);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('${widget.breed.name} added to favorites!')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final breedKey = widget.breed.displayName().toLowerCase();
    final color = BreedDetailScreenState.breedColors[breedKey] ??
        BreedDetailScreenState.breedColors['default']!;
    final logo = BreedDetailScreenState.breedLogos[breedKey] ??
        BreedDetailScreenState.breedLogos['default']!;
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Icon(logo, color: color),
            const SizedBox(width: 8),
            Text(widget.breed.name),
          ],
        ),
        backgroundColor: color,
      ),
      body: FutureBuilder<Uint8List>(
        future: imageFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('${snapshot.error}'));
          }
          final bytes = snapshot.data!;
          return LayoutBuilder(
            builder: (context, constraints) {
              final maxImageHeight = constraints.maxWidth >= 1000
                  ? 420.0
                  : constraints.maxHeight * 0.45;

              return SafeArea(
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      Container(
                        width: double.infinity,
                        constraints: BoxConstraints(maxHeight: maxImageHeight),
                        color: color.withOpacity(0.25),
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            AspectRatio(
                              aspectRatio: 4 / 3,
                              child: Image.memory(
                                bytes,
                                fit: BoxFit.cover,
                                width: double.infinity,
                                height: double.infinity,
                              ),
                            ),
                            Positioned(
                              left: 12,
                              right: 12,
                              bottom: 12,
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 10,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.black.withValues(alpha: 0.55),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  'Meet ${_profile.name}',
                                  style: Theme.of(context)
                                      .textTheme
                                      .titleMedium
                                      ?.copyWith(color: Colors.white),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.breed.displayName(),
                              style: Theme.of(context).textTheme.headlineMedium,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Breed: ' + widget.breed.displayName(),
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                            const SizedBox(height: 8),
                            Text('Name: ${_profile.name}',
                                style: Theme.of(context).textTheme.titleMedium),
                            const SizedBox(height: 8),
                            Text('Age: ${_profile.age}',
                                style: Theme.of(context).textTheme.bodyLarge),
                            const SizedBox(height: 8),
                            Text('Temperament: ${_profile.temperament}',
                                style: Theme.of(context).textTheme.bodyLarge),
                            const SizedBox(height: 8),
                            Text(
                                'Favorite Activities: ${_profile.favoriteActivities}',
                                style: Theme.of(context).textTheme.bodyLarge),
                            const SizedBox(height: 8),
                            Text('Special Trait: ${_profile.specialTrait}',
                                style: Theme.of(context).textTheme.bodyLarge),
                            const SizedBox(height: 8),
                            Text('Status: ${_profile.status}',
                                style: Theme.of(context).textTheme.bodyLarge),
                            const SizedBox(height: 16),
                            Padding(
                              padding:
                                  const EdgeInsets.only(top: 8.0, bottom: 8.0),
                              child: Text(
                                uniqueMessages[_profile.name.codeUnits
                                        .fold(0, (p, c) => p + c) %
                                    uniqueMessages.length],
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyLarge
                                    ?.copyWith(
                                        color: Colors.deepOrange,
                                        fontWeight: FontWeight.bold),
                                textAlign: TextAlign.left,
                              ),
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: [
                                ElevatedButton.icon(
                                  onPressed: refresh,
                                  icon: const Icon(Icons.navigate_next),
                                  label: const Text('Next'),
                                ),
                                ElevatedButton.icon(
                                  onPressed: toggleFavorite,
                                  icon: Icon(saved
                                      ? Icons.favorite
                                      : Icons.favorite_border),
                                  label:
                                      Text(saved ? 'Unfavorite' : 'Favorite'),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
