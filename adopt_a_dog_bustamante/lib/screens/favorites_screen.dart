import 'package:adopt_a_dog/services/dog_api_service.dart';
import 'package:adopt_a_dog/services/prefs_service.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final PrefsService _prefsService = PrefsService();
  final DogApiService _apiService = DogApiService();
  final Map<String, Future<String>> _imageCache = {};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Favorites'),
      ),
      body: FutureBuilder<List<String>>(
        future: _prefsService.loadFavorites(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.favorite_border,
                    size: 80,
                    color: Colors.grey,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'No Favorites Yet',
                    style: GoogleFonts.poppins(
                      fontSize: 24,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Add a favorite breed from the list',
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            );
          }

          final favorites = snapshot.data!;
          return _buildGridView(favorites);
        },
      ),
    );
  }

  Widget _buildGridView(List<String> favorites) {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 0.9,
      ),
      itemCount: favorites.length,
      itemBuilder: (context, index) {
        final breedName = favorites[index];
        return _AnimatedFavoriteCard(
          index: index,
          breedName: breedName,
          apiService: _apiService,
          imageCache: _imageCache,
          prefsService: _prefsService,
          onRemove: () => setState(() {}),
        );
      },
    );
  }
}

class _AnimatedFavoriteCard extends StatefulWidget {
  final int index;
  final String breedName;
  final DogApiService apiService;
  final Map<String, Future<String>> imageCache;
  final PrefsService prefsService;
  final VoidCallback onRemove;

  const _AnimatedFavoriteCard({
    required this.index,
    required this.breedName,
    required this.apiService,
    required this.imageCache,
    required this.prefsService,
    required this.onRemove,
  });

  @override
  State<_AnimatedFavoriteCard> createState() => _AnimatedFavoriteCardState();
}

class _AnimatedFavoriteCardState extends State<_AnimatedFavoriteCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    _scaleAnimation = Tween<double>(begin: 0.8, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    // Stagger effect based on index
    Future.delayed(Duration(milliseconds: widget.index * 50), () {
      if (mounted) {
        _controller.forward();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Cache the future to avoid multiple API calls
    widget.imageCache[widget.breedName] ??=
        widget.apiService.fetchRandomDogImage(widget.breedName);

    return FadeTransition(
      opacity: _fadeAnimation,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: FutureBuilder<String>(
          future: widget.imageCache[widget.breedName]!,
          builder: (context, imageSnapshot) {
            return Card(
              elevation: 3,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Stack(
                children: [
                  // Image background
                  Column(
                    children: [
                      Expanded(
                        child: _buildImageWidget(imageSnapshot),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(12),
                        child: Text(
                          widget.breedName[0].toUpperCase() +
                              widget.breedName.substring(1),
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  // Delete button overlay
                  Positioned(
                    top: 8,
                    right: 8,
                    child: GestureDetector(
                      onTap: () => _removeFavorite(),
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.red.withOpacity(0.9),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        padding: const EdgeInsets.all(6),
                        child: const Icon(
                          Icons.close,
                          color: Colors.white,
                          size: 18,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildImageWidget(AsyncSnapshot<String> imageSnapshot) {
    if (imageSnapshot.connectionState == ConnectionState.waiting) {
      return Center(
        child: Container(
          color: Colors.grey[200],
          child: const SizedBox(
            width: 30,
            height: 30,
            child: CircularProgressIndicator(strokeWidth: 2),
          ),
        ),
      );
    }

    if (imageSnapshot.hasError || !imageSnapshot.hasData) {
      return Center(
        child: Container(
          color: Colors.grey[200],
          child: const Icon(Icons.broken_image, color: Colors.grey, size: 40),
        ),
      );
    }

    return Center(
      child: ClipRRect(
        borderRadius: const BorderRadius.vertical(
          top: Radius.circular(12),
        ),
        child: CachedNetworkImage(
          imageUrl: imageSnapshot.data!,
          fit: BoxFit.cover,
          placeholder: (context, url) => Container(
            color: Colors.grey[200],
            child: const Center(
              child: CircularProgressIndicator(),
            ),
          ),
          errorWidget: (context, url, error) => Container(
            color: Colors.grey[200],
            child: const Center(
              child: Icon(Icons.broken_image, color: Colors.grey),
            ),
          ),
        ),
      ),
    );
  }

  void _removeFavorite() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
          'Remove Favorite?',
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.w600,
          ),
        ),
        content: Text(
          'Remove ${widget.breedName[0].toUpperCase() + widget.breedName.substring(1)} from favorites?',
          style: GoogleFonts.poppins(),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Cancel',
              style: GoogleFonts.poppins(
                color: const Color(0xFF8B0000),
              ),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              widget.prefsService.removeFavorite(widget.breedName);
              widget.onRemove();
            },
            child: Text(
              'Remove',
              style: GoogleFonts.poppins(
                color: Colors.red,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
