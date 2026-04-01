import 'package:flutter/material.dart';
import '../models/breed.dart';
import '../services/dog_api_service.dart';
import '../services/prefs_service.dart';

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
  String? _selectedSubBreed;

  @override
  void initState() {
    super.initState();
    _loadImage();
  }

  void _loadImage() {
    final breedName = widget.breed.name;
    final sub = _selectedSubBreed;
    final path = sub != null ? '$breedName/$sub' : breedName;
    _imageFuture = _api.fetchRandomImage(path);
  }

  void _refresh() =>
      setState(() {
        _loadImage();
        _saved = false;
      });

  Future<void> _saveFavorite() async {
    await _prefs.saveFavorite(widget.breed.name);
    setState(() => _saved = true);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('${widget.breed.name} saved!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.breed.name)),
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
          return Stack(
            children: [
              // Full-screen image
              Column(
                children: [
                  // Sub-breed chips
                  if (widget.breed.subBreeds.isNotEmpty)
                    SizedBox(
                      height: 50,
                      child: ListView(
                        scrollDirection: Axis.horizontal,
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(8),
                            child: ChoiceChip(
                              label: const Text('All'),
                              selected: _selectedSubBreed == null,
                              onSelected: (_) {
                                setState(() {
                                  _selectedSubBreed = null;
                                  _loadImage();
                                });
                              },
                            ),
                          ),
                          ...widget.breed.subBreeds.map((sub) {
                            return Padding(
                              padding: const EdgeInsets.all(8),
                              child: ChoiceChip(
                                label: Text(sub),
                                selected: _selectedSubBreed == sub,
                                onSelected: (_) {
                                  setState(() {
                                    _selectedSubBreed = sub;
                                    _loadImage();
                                  });
                                },
                              ),
                            );
                          }),
                        ],
                      ),
                    ),
                  Expanded(
                    child: Image.network(
                      url,
                      fit: BoxFit.cover,
                      width: double.infinity,
                      height: double.infinity,
                      loadingBuilder: (ctx, child, progress) =>
                          progress == null
                              ? child
                              : const Center(
                                  child: CircularProgressIndicator()),
                      errorBuilder: (ctx, err, stack) =>
                          const Icon(Icons.broken_image, size: 64),
                    ),
                  ),
                ],
              ),
              // Buttons overlay at bottom
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: Container(
                  color: Colors.black54,
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      ElevatedButton.icon(
                        onPressed: _refresh,
                        icon: const Icon(Icons.refresh),
                        label: const Text('New Photo'),
                      ),
                      ElevatedButton.icon(
                        onPressed: _saved ? null : _saveFavorite,
                        icon: Icon(_saved
                            ? Icons.favorite
                            : Icons.favorite_border),
                        label: const Text('Favorite'),
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