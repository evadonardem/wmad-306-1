import 'package:adopt_a_dog/models/breed.dart';
import 'package:adopt_a_dog/screens/breed_detail_screen.dart';
import 'package:adopt_a_dog/services/dog_api_service.dart';
import 'package:adopt_a_dog/services/prefs_service.dart';
import 'package:adopt_a_dog/widgets/responsive_image.dart';
import 'package:flutter/material.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final PrefsService _prefsService = PrefsService();
  final DogApiService _apiService = DogApiService();
  List<String> _favorites = [];
  Map<String, Future<String>> _imageFutures = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadFavorites();
  }

  Future<void> _loadFavorites() async {
    setState(() => _isLoading = true);
    final favorites = await _prefsService.loadFavorites();
    setState(() {
      _favorites = favorites;
      _imageFutures = {
        for (var breed in favorites)
          breed: _apiService.fetchRandomImage(breed)
      };
      _isLoading = false;
    });
  }

  Future<void> _removeFavorite(String breedName) async {
    await _prefsService.removeFavorite(breedName);
    setState(() {
      _favorites.remove(breedName);
      _imageFutures.remove(breedName);
    });
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('$breedName removed from favorites'),
          duration: const Duration(seconds: 1),
        ),
      );
    }
  }

  void _navigateToBreedDetail(String breedName) {
    // Create a Breed object from the breed name
    final breed = Breed(
      name: breedName,
      subBreeds: [], // We don't have sub-breed info here, but it's okay
    );
    
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => BreedDetailScreen(breed: breed),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isWeb = MediaQuery.of(context).size.width > 800;
    
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        title: const Text('Favorite Breeds'),
        centerTitle: true,
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF6366F1)),
              ),
            )
          : _favorites.isEmpty
              ? _buildEmptyState()
              : isWeb
                  ? GridView.builder(
                      padding: const EdgeInsets.all(20),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 3,
                        crossAxisSpacing: 20,
                        mainAxisSpacing: 20,
                        childAspectRatio: 0.85,
                      ),
                      itemCount: _favorites.length,
                      itemBuilder: (context, index) {
                        final breed = _favorites[index];
                        return _buildFavoriteCard(breed);
                      },
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(20),
                      itemCount: _favorites.length,
                      itemBuilder: (context, index) {
                        final breed = _favorites[index];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 16),
                          child: _buildFavoriteCard(breed),
                        );
                      },
                    ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: const Color(0xFF6366F1).withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.favorite_border,
              size: 48,
              color: const Color(0xFF6366F1).withOpacity(0.5),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'No favorites yet',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: Color(0xFF1F2937),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Tap the heart icon on any breed\nto add it to your favorites',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey.shade600,
            ),
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

  Widget _buildFavoriteCard(String breed) {
    return GestureDetector(
      onTap: () => _navigateToBreedDetail(breed),
      child: Card(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            AspectRatio(
              aspectRatio: 16 / 9,
              child: ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                child: FutureBuilder(
                  future: _imageFutures[breed],
                  builder: (context, snapshot) {
                    if (snapshot.hasData && snapshot.data != null) {
                      return ResponsiveDogImage(
                        imageUrl: snapshot.data!,
                        fit: BoxFit.cover,
                        width: double.infinity,
                        height: double.infinity,
                      );
                    }
                    return Container(
                      color: const Color(0xFFF3F4F6),
                      child: const Center(
                        child: CircularProgressIndicator(
                          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF6366F1)),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
            // Breed info with delete button
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          breed[0].toUpperCase() + breed.substring(1),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF1F2937),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Tap to view details',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey.shade500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => _removeFavorite(breed),
                    icon: Icon(
                      Icons.delete_outline,
                      color: Colors.grey.shade400,
                      size: 22,
                    ),
                    tooltip: 'Remove from favorites',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}