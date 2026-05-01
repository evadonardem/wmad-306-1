import 'package:adopt_a_dog/models/breed.dart';
import 'package:adopt_a_dog/services/dog_api_service.dart';
import 'package:adopt_a_dog/services/prefs_service.dart';
import 'package:adopt_a_dog/widgets/responsive_image.dart';
import 'package:flutter/material.dart';

class BreedDetailScreen extends StatefulWidget {
  final Breed breed;
  const BreedDetailScreen({super.key, required this.breed});

  @override
  State<BreedDetailScreen> createState() => _BreedDetailScreenState();
}

class _BreedDetailScreenState extends State<BreedDetailScreen> {
  final DogApiService _apiService = DogApiService();
  final PrefsService _prefsService = PrefsService();
  late Future<String> _imageFuture;
  bool _isFavorite = false;
  String? _selectedSubBreed;
  String _currentBreedPath = '';

  @override
  void initState() {
    super.initState();
    _currentBreedPath = widget.breed.name;
    _imageFuture = _apiService.fetchRandomImage(_currentBreedPath);
    _checkIfFavorite();
  }

  Future<void> _checkIfFavorite() async {
    _isFavorite = await _prefsService.isFavorite(widget.breed.name);
    if (mounted) setState(() {});
  }

  void _refresh() {
    setState(() {
      _imageFuture = _apiService.fetchRandomImage(_currentBreedPath);
    });
  }

  void _onSubBreedSelected(String? subBreed) {
    setState(() {
      _selectedSubBreed = subBreed;
      _currentBreedPath = subBreed != null 
          ? '${widget.breed.name}/$subBreed'
          : widget.breed.name;
      _imageFuture = _apiService.fetchRandomImage(_currentBreedPath);
    });
  }

  Future<void> _toggleFavorite() async {
    if (_isFavorite) {
      await _prefsService.removeFavorite(widget.breed.name);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${widget.breed.capitalizedName} removed'),
          duration: const Duration(seconds: 1),
        ),
      );
    } else {
      await _prefsService.saveFavorite(widget.breed.name);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${widget.breed.capitalizedName} saved'),
          duration: const Duration(seconds: 1),
        ),
      );
    }
    setState(() {
      _isFavorite = !_isFavorite;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isWeb = MediaQuery.of(context).size.width > 800;
    
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        title: Text(widget.breed.capitalizedName),
        centerTitle: true,
        actions: [
          // Single favorite button - only here
          IconButton(
            onPressed: _toggleFavorite,
            icon: Icon(
              _isFavorite ? Icons.favorite : Icons.favorite_border,
              color: _isFavorite ? const Color(0xFFEF4444) : null,
            ),
          ),
        ],
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 800),
          child: SingleChildScrollView(
            child: Column(
              children: [
                // Sub-breed chips
                if (widget.breed.hasSubBreeds)
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    child: SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        children: [
                          _buildChip('All', _selectedSubBreed == null, () => _onSubBreedSelected(null)),
                          const SizedBox(width: 8),
                          ...widget.breed.subBreeds.map((subBreed) => Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: _buildChip(
                              subBreed,
                              _selectedSubBreed == subBreed,
                              () => _onSubBreedSelected(subBreed),
                            ),
                          )),
                        ],
                      ),
                    ),
                  ),
                
                // Image
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Card(
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(24),
                      child: FutureBuilder(
                        future: _imageFuture,
                        builder: (context, snapshot) {
                          if (snapshot.connectionState != ConnectionState.done) {
                            return Container(
                              height: isWeb ? 450 : 350,
                              color: const Color(0xFFF3F4F6),
                              child: const Center(
                                child: CircularProgressIndicator(
                                  valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF6366F1)),
                                ),
                              ),
                            );
                          }

                          if (snapshot.hasError) {
                            return Container(
                              height: isWeb ? 450 : 350,
                              color: const Color(0xFFF3F4F6),
                              child: Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.error, color: Colors.grey.shade400),
                                    const SizedBox(height: 8),
                                    TextButton(
                                      onPressed: _refresh,
                                      child: const Text('Retry'),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }

                          return InteractiveViewer(
                            minScale: 0.8,
                            maxScale: 2.0,
                            child: ResponsiveDogImage(
                              imageUrl: snapshot.data!,
                              fit: BoxFit.contain,
                              height: isWeb ? 450 : 350,
                              width: double.infinity,
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                ),
                
                // New Photo Button
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 32),
                  child: OutlinedButton.icon(
                    onPressed: _refresh,
                    icon: const Icon(Icons.refresh),
                    label: const Text('New Photo'),
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size(double.infinity, 48),
                      side: const BorderSide(color: Color(0xFF6366F1)),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildChip(String label, bool isSelected, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF6366F1) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? const Color(0xFF6366F1) : Colors.grey.shade300,
          ),
        ),
        child: Text(
          label[0].toUpperCase() + label.substring(1),
          style: TextStyle(
            color: isSelected ? Colors.white : const Color(0xFF6366F1),
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}