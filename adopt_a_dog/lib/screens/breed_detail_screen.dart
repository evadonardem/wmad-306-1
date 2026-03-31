import 'package:cached_network_image/cached_network_image.dart';
import 'package:adopt_a_dog/models/breed.dart';
import 'package:adopt_a_dog/models/favorite_dog.dart';
import 'package:adopt_a_dog/screens/favorites_screen.dart';
import 'package:adopt_a_dog/services/dog_api_service.dart';
import 'package:adopt_a_dog/services/prefs_service.dart';
import 'package:flutter/material.dart';

class BreedDetailScreen extends StatefulWidget {
  final Breed breed;
  const BreedDetailScreen({super.key, required this.breed});
  @override
  State<BreedDetailScreen> createState() => _BreedDetailScreenState();
}

class _BreedDetailScreenState extends State<BreedDetailScreen> {
  late Future<String> _imageFuture;
  final _api = DogApiService();
  final _prefs = PrefsService();
  bool _saved = false;
  String? _currentImageUrl;
  String? _selectedSubBreed;

  @override
  void initState() {
    super.initState();
    _setCurrentImage();
  }

  void _setCurrentImage() {
    final imageFuture = _api.fetchRandomImage(
      widget.breed.name,
      subBreed: _selectedSubBreed,
    );

    setState(() {
      _imageFuture = imageFuture;
      _saved = false;
      _currentImageUrl = null;
    });

    imageFuture.then((imageUrl) async {
      final isSaved = await _prefs.isFavoriteImage(imageUrl);

      if (!mounted || _imageFuture != imageFuture) {
        return;
      }

      setState(() {
        _currentImageUrl = imageUrl;
        _saved = isSaved;
      });
    });
  }

  void _refresh() {
    _setCurrentImage();
  }

  void _selectSubBreed(String? subBreed) {
    setState(() {
      _selectedSubBreed = subBreed;
    });

    _setCurrentImage();
  }

  Future<void> _saveFavorite() async {
    final imageUrl = _currentImageUrl ?? await _imageFuture;
    final wasSaved = await _prefs.saveFavorite(
      FavoriteDog(
        breedName: widget.breed.name,
        imageUrl: imageUrl,
        subBreed: _selectedSubBreed,
      ),
    );

    if (!mounted) {
      return;
    }

    setState(() => _saved = wasSaved);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          wasSaved
              ? '${widget.breed.displayName()} saved!'
              : '${widget.breed.displayName()} is already in favorites.',
        ),
        duration: const Duration(milliseconds: 900),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final title = widget.breed.displayName(sub: _selectedSubBreed);

    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const FavoritesScreen()),
              );
            },
            icon: const Icon(Icons.favorite),
            tooltip: 'View favorites',
          ),
        ],
      ),
      body: FutureBuilder<String>(
        future: _imageFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('${snapshot.error}'));
          }

          final url = snapshot.data!;

          return Column(
            children: [
              if (widget.breed.subBreeds.isNotEmpty)
                SizedBox(
                  height: 64,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: const Text('All'),
                          selected: _selectedSubBreed == null,
                          onSelected: (_) => _selectSubBreed(null),
                        ),
                      ),
                      ...widget.breed.subBreeds.map(
                        (subBreed) => Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: ChoiceChip(
                            label: Text(
                              widget.breed
                                  .displayName(sub: subBreed)
                                  .split(' ')
                                  .first,
                            ),
                            selected: _selectedSubBreed == subBreed,
                            onSelected: (_) => _selectSubBreed(subBreed),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              Expanded(
                child: Container(
                  width: double.infinity,
                  color: Theme.of(context).colorScheme.surfaceContainerHighest,
                  padding: const EdgeInsets.all(16),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(20),
                    child: InteractiveViewer(
                      minScale: 1,
                      maxScale: 4,
                      child: Center(
                        child: CachedNetworkImage(
                          imageUrl: url,
                          fit: BoxFit.scaleDown,
                          filterQuality: FilterQuality.high,
                          placeholder: (context, url) {
                            return const Center(
                              child: CircularProgressIndicator(),
                            );
                          },
                          errorWidget: (context, url, error) {
                            return const Center(
                              child: Icon(Icons.broken_image, size: 64),
                            );
                          },
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              SafeArea(
                top: false,
                minimum: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.surface,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.06),
                        blurRadius: 12,
                        offset: const Offset(0, -2),
                      ),
                    ],
                  ),
                  child: Wrap(
                    alignment: WrapAlignment.center,
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      ElevatedButton.icon(
                        onPressed: _refresh,
                        icon: const Icon(Icons.refresh),
                        label: const Text('New Photo'),
                      ),
                      ElevatedButton.icon(
                        onPressed: _saved ? null : _saveFavorite,
                        icon: Icon(
                          _saved ? Icons.favorite : Icons.favorite_border,
                        ),
                        label: Text(
                          _saved ? 'Already Favorited' : 'Add Favorite',
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
