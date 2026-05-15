import 'package:flutter/material.dart';
import '../services/dog_api_service.dart';
import '../services/prefs_service.dart';
import 'breed_detail_screen.dart';
import 'favorites_screen.dart';

class BreedListScreen extends StatefulWidget {
  const BreedListScreen({super.key});

  @override
  State<BreedListScreen> createState() => _BreedListScreenState();
}

class _BreedListScreenState extends State<BreedListScreen> {
  final DogApiService _api = DogApiService();
  final PrefsService _prefs = PrefsService();

  List<String> _breeds = [];
  List<String> _filtered = [];
  String? _favoriteBreed;
  bool _isLoading = true;

  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadBreeds();
    _loadFavorite();
    _searchController.addListener(_onSearch);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadBreeds() async {
    final breeds = await _api.getAllBreeds();
    setState(() {
      _breeds = breeds;
      _filtered = breeds;
      _isLoading = false;
    });
  }

  Future<void> _loadFavorite() async {
    final favs = await _prefs.getFavorites(); // ✅ new method
    if (favs.isNotEmpty) {
      setState(() => _favoriteBreed = favs.first['breed']);
    }
  }

  void _onSearch() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      _filtered =
          _breeds.where((b) => b.toLowerCase().contains(query)).toList();
    });
  }

  Future<void> _toggleFavorite(String breed) async {
    final imageUrl = await _api.getRandomImageByBreed(breed);
    if (imageUrl == null) return;

    final isFav = await _prefs.isFavorite(breed); // ✅ new method

    if (isFav) {
      await _prefs.removeFavorite(breed); // ✅ new method
      setState(() => _favoriteBreed = null);
    } else {
      await _prefs.addFavorite(breed, imageUrl); // ✅ new method
      setState(() => _favoriteBreed = breed);
    }

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          !isFav
              ? '❤️ $breed saved to favorites!'
              : '💔 $breed removed from favorites',
        ),
        duration: const Duration(seconds: 1),
        backgroundColor: !isFav ? Colors.red : Colors.grey,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('🐶 Dog Breeds'),
        backgroundColor: Colors.orange,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.favorite),
            tooltip: 'Favorites',
            onPressed: () async {
              await Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const FavoritesScreen()),
              );
              _loadFavorite();
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search breeds...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: Colors.orange.shade50,
              ),
            ),
          ),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _filtered.isEmpty
                    ? const Center(child: Text('No breeds found'))
                    : ListView.builder(
                        itemCount: _filtered.length,
                        itemBuilder: (context, index) {
                          final breed = _filtered[index];
                          final isFav = _favoriteBreed == breed;

                          return ListTile(
                            leading: CircleAvatar(
                              backgroundColor: Colors.orange.shade100,
                              child: Text(
                                breed[0].toUpperCase(),
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.orange),
                              ),
                            ),
                            title: Text(
                              breed.toUpperCase(),
                              style:
                                  const TextStyle(fontWeight: FontWeight.w600),
                            ),
                            trailing: IconButton(
                              icon: Icon(
                                isFav ? Icons.favorite : Icons.favorite_border,
                                color: isFav ? Colors.red : Colors.grey,
                              ),
                              onPressed: () => _toggleFavorite(breed),
                            ),
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) =>
                                    BreedDetailScreen(breed: breed),
                              ),
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}