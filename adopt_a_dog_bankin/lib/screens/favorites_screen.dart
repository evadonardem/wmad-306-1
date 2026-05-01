import 'package:flutter/material.dart';
import '../services/prefs_service.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final PrefsService _prefsService = PrefsService();
  List<String> _favorites = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadFavorites();
  }

  void _loadFavorites() async {
    final favs = await _prefsService.loadFavorites();
    setState(() {
      _favorites = favs;
      _isLoading = false;
    });
  }

  void _removeFavorite(String breed) async {
    await _prefsService.removeFavorite(breed);
    _loadFavorites(); // Reload the UI after deleting
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('$breed removed from favorites')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("My Favorites"),
        actions: [
          // Add a button to clear everything at once
          if (_favorites.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.delete_sweep),
              tooltip: "Clear All",
              onPressed: () async {
                await _prefsService.clearAllFavorites();
                _loadFavorites();
              },
            )
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _favorites.isEmpty
              ? const Center(child: Text("No favorites saved yet!"))
              : ListView.builder(
                  itemCount: _favorites.length,
                  itemBuilder: (context, index) {
                    final breed = _favorites[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      child: ListTile(
                        leading: const Icon(Icons.favorite, color: Colors.red),
                        title: Text(breed, style: const TextStyle(fontWeight: FontWeight.bold)),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete_outline),
                          color: Colors.grey,
                          onPressed: () => _removeFavorite(breed),
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}