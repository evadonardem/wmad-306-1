import 'package:flutter/material.dart';
import '../services/dog_api_service.dart';
import '../services/prefs_service.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final _prefs = PrefsService();
  final _api = DogApiService();

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Favorites')),
      body: FutureBuilder<List<String>>(
        future: _favoritesFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          final favorites = snapshot.data ?? [];

          if (favorites.isEmpty) {
            return const Center(
              child: Text('No favorites yet!\nTap ♥ on any breed photo.'),
            );
          }

          return ListView.builder(
            itemCount: favorites.length,
            itemBuilder: (context, index) {
              final breed = favorites[index];
              return ListTile(
                leading: const Icon(Icons.pets),
                title: Text(breed[0].toUpperCase() + breed.substring(1)),
                trailing: IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed: () async {
                    await _prefs.removeFavorite(breed);
                    _refresh();
                  },
                ),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => _FavoriteDetail(breed: breed),
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

class _FavoriteDetail extends StatelessWidget {
  final String breed;
  const _FavoriteDetail({required this.breed});

  @override
  Widget build(BuildContext context) {
    final api = DogApiService();

    return Scaffold(
      appBar: AppBar(title: Text(breed)),
      body: FutureBuilder<String>(
        future: api.fetchRandomImage(breed),
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('${snapshot.error}'));
          }

          return Image.network(
            snapshot.data!,
            fit: BoxFit.cover,
          );
        },
      ),
    );
  }
}