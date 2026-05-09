import 'package:adopt_a_dog/models/breed.dart';
import 'package:adopt_a_dog/services/dog_api_service.dart';
import 'package:adopt_a_dog/services/prefs_service.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

class BreedDetailScreen extends StatefulWidget {
  final Breed breed;
  final String? subBreed;

  const BreedDetailScreen({super.key, required this.breed, this.subBreed});

  @override
  State<BreedDetailScreen> createState() => _BreedDetailScreenState();
}

class _BreedDetailScreenState extends State<BreedDetailScreen> {
  final DogApiService _apiService = DogApiService();
  final PrefsService _prefsService = PrefsService();

  late String? _selectedSubBreed;
  late Future<String> _imageFuture;

  @override
  void initState() {
    super.initState();
    _selectedSubBreed = widget.subBreed;
    _imageFuture = _loadImage();
  }

  Future<String> _loadImage() {
    return _apiService.fetchRandomImage(widget.breed.name, _selectedSubBreed);
  }

  Future<void> _saveFavorite() async {
    final saved = await _prefsService.saveFavorite(widget.breed.name);

    if (!mounted) {
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          saved
              ? '${widget.breed.name} saved to favorites'
              : '${widget.breed.name} is already in favorites',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final title = widget.breed.displayName(_selectedSubBreed);

    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: Text(_titleCase(title)),
        backgroundColor: Colors.white.withValues(alpha: 0.10),
        surfaceTintColor: Colors.transparent,
        elevation: 0,
      ),
      body: FutureBuilder<String>(
        future: _imageFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.broken_image_outlined, size: 48),
                    const SizedBox(height: 12),
                    Text(
                      'Could not load a dog image.\n${snapshot.error}',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    FilledButton(
                      onPressed: () {
                        setState(() {
                          _imageFuture = _loadImage();
                        });
                      },
                      child: const Text('Try again'),
                    ),
                  ],
                ),
              ),
            );
          }

          final imageUrl = snapshot.data!;

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              if (widget.breed.subBreeds.isNotEmpty) ...[
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: widget.breed.subBreeds.map((subBreed) {
                      final isSelected = subBreed == _selectedSubBreed;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text(subBreed),
                          selected: isSelected,
                          onSelected: (_) {
                            setState(() {
                              _selectedSubBreed = subBreed;
                              _imageFuture = _loadImage();
                            });
                          },
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 16),
              ],
              ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: AspectRatio(
                  aspectRatio: 1,
                  child: CachedNetworkImage(
                    imageUrl: imageUrl,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => const Center(
                      child: CircularProgressIndicator(),
                    ),
                    errorWidget: (context, url, error) => const Center(
                      child: Icon(Icons.broken_image_outlined, size: 64),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                title,
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),
              Text(
                widget.breed.subBreeds.isEmpty
                    ? 'This breed has no sub-breeds listed.'
                    : 'Pick a sub-breed above to see a different image.',
              ),
              const SizedBox(height: 24),
              FilledButton.icon(
                onPressed: _saveFavorite,
                icon: const Icon(Icons.favorite),
                label: const Text('Favorite'),
              ),
            ],
          );
        },
      ),
    );
  }
}

String _titleCase(String value) {
  return value
      .split(' ')
      .map(
        (part) => part.isEmpty
            ? part
            : part[0].toUpperCase() + part.substring(1),
      )
      .join(' ');
}
