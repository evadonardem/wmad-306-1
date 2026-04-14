import 'package:flutter/material.dart';
import '../services/dog_api_service.dart';
import '../services/prefs_service.dart';
import 'breed_detail_screen.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final prefs = PrefsService();
  final api = DogApiService();
  late Future<List<_FavoriteData>> favoritesFuture;

  @override
  void initState() {
    super.initState();
    favoritesFuture = _loadFavoritesData();
  }

  Future<List<_FavoriteData>> _loadFavoritesData() async {
    final breeds = await prefs.loadFavorites();
    final List<_FavoriteData> favorites = [];
    for (final breed in breeds) {
      // Try to load the image URL from prefs, fallback to fetching if not found (for migration)
      final imageUrl = await prefs.getFavoriteImageUrl(breed) ??
          await api.fetchRandomImage(breed);
      favorites.add(_FavoriteData(breed: breed, imageUrl: imageUrl));
    }
    return favorites;
  }

  void _refreshFavorites() {
    setState(() {
      favoritesFuture = _loadFavoritesData();
    });
  }

  Future<void> _removeFavorite(String breed) async {
    await prefs.removeFavorite(breed);
    await prefs.removeFavoriteImageUrl(breed);
    if (!mounted) return;
    _refreshFavorites();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('$breed removed from favorites')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Favorites')),
      body: FutureBuilder<List<_FavoriteData>>(
        future: favoritesFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: \\${snapshot.error}'));
          }
          final favorites = snapshot.data ?? [];
          if (favorites.isEmpty) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Text(
                  'No favorites selected yet.\\nPick a breed and tap Favorite.',
                  textAlign: TextAlign.center,
                ),
              ),
            );
          }
          return ListView.builder(
            itemCount: favorites.length,
            itemBuilder: (context, index) {
              final favorite = favorites[index];
              final breedKey = favorite.breed.toLowerCase();
              final color = BreedDetailScreenState.breedColors[breedKey] ??
                  BreedDetailScreenState.breedColors['default']!;
              final logo = BreedDetailScreenState.breedLogos[breedKey] ??
                  BreedDetailScreenState.breedLogos['default']!;
              final hash = breedKey.codeUnits.fold(0, (prev, c) => prev + c);
              final name = dogNames[hash % dogNames.length];
              final age = ages[hash % ages.length];
              final temperament = temperaments[hash % temperaments.length];
              final favActs =
                  favoriteActivities[hash % favoriteActivities.length];
              final specialTrait = specialTraits[hash % specialTraits.length];
              final status = statuses[hash % statuses.length];
              final message = uniqueMessages[
                  name.codeUnits.fold(0, (p, c) => p + c) %
                      uniqueMessages.length];
              return Card(
                margin: const EdgeInsets.all(12),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(logo, color: color),
                          const SizedBox(width: 8),
                          Text(favorite.breed,
                              style: Theme.of(context).textTheme.headlineSmall),
                          const Spacer(),
                          IconButton(
                            icon: const Icon(Icons.delete_outline),
                            onPressed: () => _removeFavorite(favorite.breed),
                            tooltip: 'Remove from favorites',
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Container(
                        width: double.infinity,
                        constraints: const BoxConstraints(maxHeight: 220),
                        color: color.withOpacity(0.25),
                        child: AspectRatio(
                          aspectRatio: 4 / 3,
                          child: Image.network(
                            favorite.imageUrl,
                            fit: BoxFit.contain,
                            errorBuilder: (ctx, err, stack) =>
                                const Icon(Icons.broken_image, size: 64),
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text('Name: $name',
                          style: Theme.of(context).textTheme.titleMedium),
                      Text('Age: $age',
                          style: Theme.of(context).textTheme.bodyLarge),
                      Text('Temperament: $temperament',
                          style: Theme.of(context).textTheme.bodyLarge),
                      Text('Favorite Activities: $favActs',
                          style: Theme.of(context).textTheme.bodyLarge),
                      Text('Special Trait: $specialTrait',
                          style: Theme.of(context).textTheme.bodyLarge),
                      Text('Status: $status',
                          style: Theme.of(context).textTheme.bodyLarge),
                      Padding(
                        padding: const EdgeInsets.only(top: 8.0, bottom: 8.0),
                        child: Text(
                          message,
                          style: Theme.of(context)
                              .textTheme
                              .bodyLarge
                              ?.copyWith(
                                  color: Colors.deepOrange,
                                  fontWeight: FontWeight.bold),
                          textAlign: TextAlign.left,
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

class _FavoriteData {
  final String breed;
  final String imageUrl;

  const _FavoriteData({required this.breed, required this.imageUrl});
}
