import 'package:flutter/material.dart';
import '../services/dog_api_service.dart';
import '../services/prefs_service.dart';
import 'package:cached_network_image/cached_network_image.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final PrefsService _prefs = PrefsService();
  final DogApiService _api = DogApiService();

  late Future<List<String>> _favoritesFuture;

  @override
  void initState() {
    super.initState();
    _favoritesFuture = _prefs.loadFavorites();
  }

  void _refresh() {
    setState(() {
      _favoritesFuture = _prefs.loadFavorites();
    });
  }

  Future<void> _remove(String breed) async {
    await _prefs.removeFavorite(breed);
    _refresh();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("My Favorites"),
      ),
      body: FutureBuilder<List<String>>(
        future: _favoritesFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          final favorites = snapshot.data!;

          if (favorites.isEmpty) {
            return const Center(
              child: Text("No favorites yet!"),
            );
          }

          return ListView.builder(
            itemCount: favorites.length,
            itemBuilder: (context, index) {
              final breed = favorites[index];

              return ListTile(
                leading: const Icon(Icons.pets),
                title: Text(breed),
                trailing: IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed: () => _remove(breed),
                ),
                onTap: () async {
                  final image = await _api.fetchRandomImage(breed);

                  showDialog(
                    context: context,
                    builder: (_) => AlertDialog(
                      content: CachedNetworkImage(
                        imageUrl: image,
                        placeholder: (context, url) =>
                            const Center(child: CircularProgressIndicator()),
                        errorWidget: (context, url, error) =>
                            const Icon(Icons.broken_image),
                      ),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}