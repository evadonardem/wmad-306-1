import 'package:adopt_a_dog/services/dog_api_service.dart';
import 'package:adopt_a_dog/services/prefs_service.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final DogApiService _apiService = DogApiService();
  final PrefsService _prefsService = PrefsService();
  late Future<List<String>> _favoritesFuture;

  @override
  void initState() {
    super.initState();
    _favoritesFuture = _prefsService.loadFavorites();
  }

  Future<void> _clearFavorite() async {
    await _prefsService.clearFavorite();

    if (!mounted) {
      return;
    }

    setState(() {
      _favoritesFuture = _prefsService.loadFavorites();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: const Text('My Favorites'),
        backgroundColor: Colors.white.withValues(alpha: 0.10),
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: _clearFavorite,
            icon: const Icon(Icons.delete_outline),
          ),
        ],
      ),
      body: FutureBuilder<List<String>>(
        future: _favoritesFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Text('Could not load favorite.\n${snapshot.error}'),
            );
          }

          final favorites = snapshot.data ?? const <String>[];

          if (favorites.isEmpty) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Text(
                  'No favorite dog saved yet. Open a breed and tap Save to favorites.',
                  textAlign: TextAlign.center,
                ),
              ),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: favorites.length,
            separatorBuilder: (context, index) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              return _FavoriteBreedCard(
                breedName: favorites[index],
                apiService: _apiService,
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _clearFavorite,
        icon: const Icon(Icons.delete_outline),
        label: const Text('Clear all'),
      ),
    );
  }
}

class _FavoriteBreedCard extends StatefulWidget {
  final String breedName;
  final DogApiService apiService;

  const _FavoriteBreedCard({required this.breedName, required this.apiService});

  @override
  State<_FavoriteBreedCard> createState() => _FavoriteBreedCardState();
}

class _FavoriteBreedCardState extends State<_FavoriteBreedCard> {
  late Future<String> _imageFuture;

  @override
  void initState() {
    super.initState();
    _imageFuture = widget.apiService.fetchRandomImage(widget.breedName);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String>(
      future: _imageFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        if (snapshot.hasError) {
          return Card(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Text(
                'Could not load ${widget.breedName}.\n${snapshot.error}',
              ),
            ),
          );
        }

        final imageUrl = snapshot.data!;

        return Card(
          clipBehavior: Clip.antiAlias,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              AspectRatio(
                aspectRatio: 1,
                child: CachedNetworkImage(
                  imageUrl: imageUrl,
                  fit: BoxFit.cover,
                  placeholder: (context, url) =>
                      const Center(child: CircularProgressIndicator()),
                  errorWidget: (context, url, error) => const Center(
                    child: Icon(Icons.broken_image_outlined, size: 64),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  widget.breedName,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
