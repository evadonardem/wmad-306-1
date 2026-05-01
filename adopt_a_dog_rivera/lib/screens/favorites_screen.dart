import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/breed.dart';
import '../services/dog_api_service.dart';
import '../services/prefs_service.dart';
import 'breed_detail_screen.dart';
import '../utils/responsive.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final _prefs = PrefsService();
  late Future<List<String>> _favoritesFuture;

  @override
  void initState() {
    super.initState();
    _favoritesFuture = _prefs.getFavorites();
  }

  void _refreshFavorites() {
    setState(() {
      _favoritesFuture = _prefs.getFavorites();
    });
  }

  void _removeFavorite(String breed) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Remove Favorite?'),
        content: Text('Remove "$breed" from favorites?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await _prefs.removeFavorite(breed);
              if (!mounted) return;
              _refreshFavorites();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    'Removed ${breed[0].toUpperCase()}${breed.substring(1)} from favorites',
                  ),
                  duration: const Duration(seconds: 2),
                ),
              );
            },
            child: const Text('Remove', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final crossAxisCount = calculateGridCount(
      context,
      minItemWidth: 260,
      minCount: 2,
      maxCount: 6,
    );

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        automaticallyImplyLeading: false,
        title: Row(
          children: [
            Image.asset(
              'assets/FurEverHome.png',
              height: 40,
              width: 40,
              errorBuilder: (context, error, stackTrace) =>
                  const Icon(Icons.pets, size: 40),
            ),
            const SizedBox(width: 12),
            const Text(
              'My Favorites',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
      body: FutureBuilder<List<String>>(
        future: _favoritesFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(
                    color: Theme.of(context).primaryColor,
                    strokeWidth: 4,
                  ),
                  const SizedBox(height: 16),
                  const Text('Loading favorites...'),
                ],
              ),
            );
          }

          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  'Error loading favorites: ${snapshot.error}',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.red,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            );
          }

          final favorites = snapshot.data ?? [];

          if (favorites.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.favorite_border,
                    size: 80,
                    color: Colors.grey[400],
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'No Favorites Yet',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Colors.grey[700],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Add dog breeds to your favorites',
                    textAlign: TextAlign.center,
                    style: Theme.of(
                      context,
                    ).textTheme.bodyMedium?.copyWith(color: Colors.grey[600]),
                  ),
                  const SizedBox(height: 32),
                  ElevatedButton.icon(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.arrow_back),
                    label: const Text('Browse Breeds'),
                  ),
                ],
              ),
            );
          }

          return SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${favorites.length} Favorite${favorites.length != 1 ? 's' : ''}',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Colors.grey[700],
                    ),
                  ),
                  const SizedBox(height: 16),
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: crossAxisCount,
                      childAspectRatio: 1,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                    ),
                    itemCount: favorites.length,
                    itemBuilder: (context, index) {
                      final breedName = favorites[index];
                      return _FavoritePetCard(
                        breedName: breedName,
                        onRemove: () => _removeFavorite(breedName),
                      );
                    },
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

/// Favorite pet card with remove button
class _FavoritePetCard extends StatefulWidget {
  final String breedName;
  final VoidCallback onRemove;

  const _FavoritePetCard({required this.breedName, required this.onRemove});

  @override
  State<_FavoritePetCard> createState() => _FavoritePetCardState();
}

class _FavoritePetCardState extends State<_FavoritePetCard> {
  late final _FavoriteBreedInfo _favoriteInfo;
  late final Future<String> _imageFuture;

  @override
  void initState() {
    super.initState();
    _favoriteInfo = _parseFavoriteLabel(widget.breedName);
    _imageFuture = DogApiService().fetchRandomImage(_favoriteInfo.imagePath);
  }

  _FavoriteBreedInfo _parseFavoriteLabel(String label) {
    // Expected format from BreedDetailScreen:
    // - 'DogName Breed' for breed-only favorites
    // - 'DogName SubBreed Breed' for sub-breed favorites
    final parts = label.split(' ');
    if (parts.length >= 2) {
      final breed = parts.last.toLowerCase();
      final subBreedParts = parts.sublist(1, parts.length - 1);
      return _FavoriteBreedInfo(
        breed: breed,
        subBreed: subBreedParts.isNotEmpty
            ? subBreedParts.join(' ').toLowerCase()
            : null,
        displayName: label,
      );
    }

    final parenthesizedMatch = RegExp(r'\(([^)]+)\)$').firstMatch(label);
    if (parenthesizedMatch != null) {
      final breedString = parenthesizedMatch.group(1)!.toLowerCase();
      final breedParts = breedString.split(' ');
      final breed = breedParts.last;
      final subBreed = breedParts.length > 1
          ? breedParts.sublist(0, breedParts.length - 1).join(' ')
          : null;
      return _FavoriteBreedInfo(
        breed: breed,
        subBreed: subBreed,
        displayName: label,
      );
    }

    return _FavoriteBreedInfo(breed: label.toLowerCase(), displayName: label);
  }

  @override
  Widget build(BuildContext context) {
    final displayName = _favoriteInfo.displayName;

    return GestureDetector(
      onTap: () {
        final breed = Breed(
          name: _favoriteInfo.breed,
          subBreeds: _favoriteInfo.subBreed != null
              ? [_favoriteInfo.subBreed!]
              : [],
        );
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => BreedDetailScreen(breed: breed)),
        );
      },
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Colors.pink.shade100, Colors.pink.shade50],
            ),
          ),
          child: Stack(
            children: [
              FutureBuilder<String>(
                future: _imageFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState != ConnectionState.done) {
                    return Center(
                      child: CircularProgressIndicator(
                        color: Theme.of(context).primaryColor,
                      ),
                    );
                  }

                  if (!snapshot.hasData) {
                    return Center(
                      child: Icon(
                        Icons.error,
                        color: Colors.grey[400],
                        size: 40,
                      ),
                    );
                  }

                  final imageUrl = snapshot.data!;
                  return Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: Colors.pink[400]!,
                            width: 4,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.pink[400]!.withOpacity(0.3),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: ClipOval(
                          child: CachedNetworkImage(
                            imageUrl: imageUrl,
                            fit: BoxFit.cover,
                            placeholder: (context, url) => Container(
                              color: Colors.grey[300],
                              child: Center(
                                child: CircularProgressIndicator(
                                  color: Theme.of(context).primaryColor,
                                ),
                              ),
                            ),
                            errorWidget: (context, url, error) => Container(
                              color: Colors.grey[300],
                              child: Icon(
                                Icons.pets,
                                color: Colors.grey[500],
                                size: 40,
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8.0),
                        child: Text(
                          displayName,
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.titleSmall
                              ?.copyWith(fontWeight: FontWeight.bold),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8.0,
                          vertical: 4.0,
                        ),
                        child: Text(
                          '♥ Saved',
                          style: Theme.of(context).textTheme.bodySmall
                              ?.copyWith(
                                color: Colors.pink[400],
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                      ),
                    ],
                  );
                },
              ),
              // Remove button (top-right)
              Positioned(
                top: 8,
                right: 8,
                child: Container(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: IconButton(
                    iconSize: 20,
                    padding: const EdgeInsets.all(6),
                    icon: const Icon(Icons.close, color: Colors.red),
                    onPressed: widget.onRemove,
                    tooltip: 'Remove from favorites',
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _FavoriteBreedInfo {
  final String breed;
  final String? subBreed;
  final String displayName;

  _FavoriteBreedInfo({
    required this.breed,
    this.subBreed,
    required this.displayName,
  });

  String get imagePath {
    if (subBreed != null && subBreed!.isNotEmpty) {
      return '$breed/$subBreed';
    }
    return breed;
  }
}
