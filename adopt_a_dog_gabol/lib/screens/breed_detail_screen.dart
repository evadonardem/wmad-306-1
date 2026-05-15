import 'package:flutter/material.dart';
import '../services/dog_api_service.dart';
import '../services/prefs_service.dart';

class BreedDetailScreen extends StatefulWidget {
  final String breed;
  const BreedDetailScreen({super.key, required this.breed});

  @override
  State<BreedDetailScreen> createState() => _BreedDetailScreenState();
}

class _BreedDetailScreenState extends State<BreedDetailScreen> {
  final DogApiService _api = DogApiService();
  final PrefsService _prefs = PrefsService();

  String? _imageUrl;
  bool _isLoading = true;
  bool _isLiked = false;
  bool _isBarking = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final image = await _api.getRandomImageByBreed(widget.breed);
    final liked = await _prefs.isFavorite(widget.breed); // ✅ new method
    setState(() {
      _imageUrl = image;
      _isLiked = liked;
      _isLoading = false;
    });
  }

  Future<void> _toggleLike() async {
    if (_isLiked) {
      await _prefs.removeFavorite(widget.breed); // ✅ remove from list
      setState(() => _isLiked = false);
    } else {
      if (_imageUrl != null) {
        await _prefs.addFavorite(widget.breed, _imageUrl!); // ✅ add to list
        setState(() => _isLiked = true);
      }
    }

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _isLiked
              ? '❤️ ${widget.breed} saved to favorites!'
              : '💔 Removed from favorites',
        ),
        duration: const Duration(seconds: 1),
        backgroundColor: _isLiked ? Colors.red : Colors.grey,
      ),
    );
  }

  Future<void> _refreshImage() async {
    setState(() => _isLoading = true);
    final image = await _api.getRandomImageByBreed(widget.breed);
    setState(() {
      _imageUrl = image;
      _isLoading = false;
    });
  }

  void _toggleBark() async {
    setState(() => _isBarking = true);
    await Future.delayed(const Duration(seconds: 2));
    if (mounted) setState(() => _isBarking = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: Text(widget.breed.toUpperCase()),
        backgroundColor: Colors.orange,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _refreshImage,
            tooltip: 'New photo',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _imageUrl == null
              ? const Center(
                  child: Text('No image found',
                      style: TextStyle(color: Colors.white)))
              : Stack(
                  fit: StackFit.expand,
                  children: [
                    // 📸 Dog Photo
                    Image.network(_imageUrl!, fit: BoxFit.cover),

                    // Gradient overlay
                    Positioned(
                      bottom: 0,
                      left: 0,
                      right: 0,
                      child: Container(
                        height: 160,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.bottomCenter,
                            end: Alignment.topCenter,
                            colors: [
                              Colors.black.withOpacity(0.85),
                              Colors.transparent,
                            ],
                          ),
                        ),
                      ),
                    ),

                    // Buttons
                    Positioned(
                      bottom: 40,
                      left: 0,
                      right: 0,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          // 🔊 Bark Button
                          GestureDetector(
                            onTap: _toggleBark,
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 300),
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: _isBarking
                                    ? Colors.orange
                                    : Colors.white.withOpacity(0.2),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                _isBarking
                                    ? Icons.volume_up
                                    : Icons.volume_off,
                                color: Colors.white,
                                size: 32,
                              ),
                            ),
                          ),

                          const SizedBox(width: 40),

                          // ❤️ Like Button
                          GestureDetector(
                            onTap: _toggleLike,
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 300),
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: _isLiked
                                    ? Colors.red
                                    : Colors.white.withOpacity(0.2),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                _isLiked
                                    ? Icons.favorite
                                    : Icons.favorite_border,
                                color: Colors.white,
                                size: 32,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
    );
  }
}