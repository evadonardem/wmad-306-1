import 'package:adopt_a_dog/models/breed.dart';
import 'package:adopt_a_dog/services/prefs_service.dart';
import 'package:flutter/material.dart';

class BreedDetailScreen extends StatefulWidget {
  final Breed breed;
  const BreedDetailScreen({super.key, required this.breed});

  @override
  State<BreedDetailScreen> createState() => _BreedDetailScreenState();
}

class _BreedDetailScreenState extends State<BreedDetailScreen> {
  bool isFavorite = false;
  final prefsService = PrefsService();

  @override
  void initState() {
    super.initState();
    _checkIfFavorite();
  }

  Future<void> _checkIfFavorite() async {
    final favorite = await prefsService.loadFavorite();
    setState(() {
      isFavorite = favorite == widget.breed.name;
    });
  }

  Future<void> _toggleFavorite() async {
    if (isFavorite) {
      await prefsService.clearFavorite();
    } else {
      await prefsService.saveFavorite(widget.breed.name);
    }
    setState(() {
      isFavorite = !isFavorite;
    });

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          isFavorite
              ? '${widget.breed.name} added to favorites! 🐾'
              : '${widget.breed.name} removed from favorites',
        ),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final imageUrl =
        'https://dog.ceo/api/breed/${widget.breed.name}/images/random';

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.breed.name.toUpperCase()),
        elevation: 0,
        actions: [
          IconButton(
            onPressed: _toggleFavorite,
            icon: Icon(
              isFavorite ? Icons.favorite : Icons.favorite_outline,
              color: isFavorite ? Colors.red : Colors.white,
            ),
            tooltip: isFavorite ? 'Remove from favorites' : 'Add to favorites',
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Dog Image
            Container(
              height: 300,
              color: Colors.grey[200],
              child: Image.network(
                imageUrl,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.image_not_supported,
                            size: 64, color: Colors.grey),
                        const SizedBox(height: 16),
                        const Text('Image not available'),
                      ],
                    ),
                  );
                },
              ),
            ),
            // Breed Info
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Breed Name
                  Text(
                    widget.breed.name.toUpperCase(),
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: Colors.green,
                        ),
                  ),
                  const SizedBox(height: 24),

                  // Sub-breeds Section
                  if (widget.breed.subBreeds.isNotEmpty) ...[
                    Text(
                      'Available Variations',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        for (final subBreed in widget.breed.subBreeds)
                          Chip(
                            label: Text(subBreed),
                            backgroundColor: Colors.green[100],
                            labelStyle: const TextStyle(color: Colors.green),
                            avatar: const Icon(Icons.pets, size: 18),
                          ),
                      ],
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Information Card
                  Card(
                    color: Colors.green[50],
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'About this breed',
                            style: Theme.of(context).textTheme.titleMedium
                                ?.copyWith(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 12),
                          _buildInfoRow(
                            'Breed Name',
                            widget.breed.name,
                            Icons.pets,
                          ),
                          const Divider(),
                          _buildInfoRow(
                            'Number of Variations',
                            '${widget.breed.subBreeds.length}',
                            Icons.list,
                          ),
                          const Divider(),
                          _buildInfoRow(
                            'Status',
                            'Available for adoption',
                            Icons.check_circle,
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Action Buttons
                  ElevatedButton.icon(
                    onPressed: _toggleFavorite,
                    icon: Icon(isFavorite ? Icons.favorite : Icons.favorite_outline),
                    label: Text(
                      isFavorite ? 'Remove from Favorites' : 'Add to Favorites',
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor:
                          isFavorite ? Colors.red : Colors.green,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.arrow_back),
                    label: const Text('Back to List'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: Colors.green, size: 20),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
            ),
            Text(
              value,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
