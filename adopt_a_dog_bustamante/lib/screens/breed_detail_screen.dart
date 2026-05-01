import 'package:adopt_a_dog/models/breed.dart';
import 'package:adopt_a_dog/services/dog_api_service.dart';
import 'package:adopt_a_dog/services/prefs_service.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class BreedDetailScreen extends StatefulWidget {
  final Breed breed;
  const BreedDetailScreen({super.key, required this.breed});
  @override
  State<BreedDetailScreen> createState() => _BreedDetailScreenState();
}

class _BreedDetailScreenState extends State<BreedDetailScreen>
    with SingleTickerProviderStateMixin {
  late Future<String> _imageFuture;
  final DogApiService _apiService = DogApiService();
  final PrefsService _prefsService = PrefsService();
  bool _isFavorited = false;
  late AnimationController _favoriteController;
  late Animation<double> _favoriteScale;
  String? _selectedSubBreed; // Track selected sub-breed

  @override
  void initState() {
    super.initState();
    _loadImage();
    _checkIfFavorited();
    
    _favoriteController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
    
    _favoriteScale = Tween<double>(begin: 1, end: 1.1).animate(
      CurvedAnimation(parent: _favoriteController, curve: Curves.elasticOut),
    );
  }

  @override
  void dispose() {
    _favoriteController.dispose();
    super.dispose();
  }

  void _loadImage() {
    setState(() {
      final breedName = _selectedSubBreed ?? widget.breed.name;
      _imageFuture = _apiService.fetchRandomDogImage(breedName);
    });
  }

  Future<void> _checkIfFavorited() async {
    final isFav = await _prefsService.isFavorited(widget.breed.name);
    setState(() {
      _isFavorited = isFav;
    });
  }

  Future<void> _saveFavorite() async {
    await _prefsService.saveFavorite(widget.breed.name);
    final isFav = await _prefsService.isFavorited(widget.breed.name);
    setState(() {
      _isFavorited = isFav;
    });
    
    // Trigger animation
    _favoriteController.forward().then((_) {
      _favoriteController.reverse();
    });
    
    if (mounted) {
        if (isFav) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('${widget.breed.name} added to favorites!'),
              duration: const Duration(seconds: 2),
            ),
          );
        }
      }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.breed.name[0].toUpperCase() + widget.breed.name.substring(1),
        ),
      ),
      body: FutureBuilder<String>(
        future: _imageFuture,
        builder: (context, snapshot) {
          return Stack(
            children: [
              // Main content
              Column(
                children: [
                  // Sub-breed chips
                  if (widget.breed.subBreeds.isNotEmpty)
                    _buildSubBreedChips(),
                  Expanded(
                    child: _buildImageContent(snapshot),
                  ),
                  _buildButtonBar(),
                ],
              ),
              // Loading overlay if needed
              if (snapshot.connectionState == ConnectionState.waiting)
                Container(
                  color: Colors.black.withOpacity(0.3),
                  child: const Center(
                    child: CircularProgressIndicator(),
                  ),
                ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildSubBreedChips() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          // Parent breed chip
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: FilterChip(
              label: Text(
                'All (${widget.breed.name})',
                style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
              ),
              selected: _selectedSubBreed == null,
              onSelected: (selected) {
                setState(() {
                  _selectedSubBreed = null;
                });
                _loadImage();
              },
              backgroundColor: Colors.grey[200],
              selectedColor: const Color(0xFF8B0000).withOpacity(0.3),
            ),
          ),
          // Sub-breed chips
          ...widget.breed.subBreeds.map((subBreed) {
            final fullBreedPath = '${widget.breed.name}/$subBreed';
            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: FilterChip(
                label: Text(
                  subBreed,
                  style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
                ),
                selected: _selectedSubBreed == fullBreedPath,
                onSelected: (selected) {
                  setState(() {
                    _selectedSubBreed = selected ? fullBreedPath : null;
                  });
                  _loadImage();
                },
                backgroundColor: Colors.grey[200],
                selectedColor: const Color(0xFF8B0000).withOpacity(0.3),
              ),
            );
          }).toList(),
        ],
      ),
    );
  }

  Widget _buildImageContent(AsyncSnapshot<String> snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting &&
        !snapshot.hasData) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (snapshot.hasError) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            const Text('Failed to load image'),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: _loadImage,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (!snapshot.hasData) {
      return const Center(child: Text('No image available'));
    }

    return Container(
      padding: const EdgeInsets.all(16),
      child: Center(
        child: ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: CachedNetworkImage(
            imageUrl: snapshot.data!,
            fit: BoxFit.cover,
            placeholder: (context, url) => Container(
              color: Colors.grey[200],
              child: const Center(
                child: CircularProgressIndicator(),
              ),
            ),
            errorWidget: (context, url, error) => const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.broken_image, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('Could not load image'),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildButtonBar() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Expanded(
            child: ElevatedButton.icon(
              onPressed: _loadImage,
              icon: const Icon(Icons.refresh),
              label: Text(
                'New Photo',
                style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: ScaleTransition(
              scale: _favoriteScale,
              child: ElevatedButton.icon(
                onPressed: _isFavorited ? null : _saveFavorite,
                icon: Icon(
                    _isFavorited ? Icons.favorite : Icons.favorite_border),
                label: Text(
                  _isFavorited ? 'Favorited' : 'Favorite',
                  style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor:
                      _isFavorited ? Colors.grey : const Color(0xFF8B0000),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
