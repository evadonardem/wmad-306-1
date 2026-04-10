import 'package:flutter/material.dart';
import '../services/dog_api_service.dart';
import '../services/prefs_service.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final prefs = PrefsService();
  final api = DogApiService();
  late Future<_FavoriteData?> favoriteFuture;

  @override
  void initState() {
    super.initState();
    favoriteFuture = _loadFavoriteData();
  }

  Future<_FavoriteData?> _loadFavoriteData() async {
    final breed = await prefs.loadFavorite();
    if (breed == null || breed.isEmpty) {
      return null;
    }

    final imageUrl = await api.fetchRandomImage(breed);
    return _FavoriteData(breed: breed, imageUrl: imageUrl);
  }

  void _refreshImage() {
    setState(() {
      favoriteFuture = _loadFavoriteData();
    });
  }

  Future<void> _clearFavorite() async {
    await prefs.clearFavorite();
    if (!mounted) {
      return;
    }
    setState(() {
      favoriteFuture = _loadFavoriteData();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Favorite removed')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Favorite')),
      body: FutureBuilder<_FavoriteData?>(
        future: favoriteFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final favorite = snapshot.data;
          if (favorite == null) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Text(
                  'No favorite selected yet.\nPick a breed and tap Favorite.',
                  textAlign: TextAlign.center,
                ),
              ),
            );
          }

          return Column(
            children: [
              Expanded(
                child: Image.network(
                  favorite.imageUrl,
                  fit: BoxFit.cover,
                  width: double.infinity,
                  loadingBuilder: (ctx, child, progress) =>
                      progress == null
                          ? child
                          : const Center(child: CircularProgressIndicator()),
                  errorBuilder: (ctx, err, stack) =>
                      const Icon(Icons.broken_image, size: 64),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Text(
                      favorite.breed,
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        ElevatedButton.icon(
                          onPressed: _refreshImage,
                          icon: const Icon(Icons.refresh),
                          label: const Text('New Photo'),
                        ),
                        ElevatedButton.icon(
                          onPressed: _clearFavorite,
                          icon: const Icon(Icons.delete_outline),
                          label: const Text('Clear Favorite'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
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
