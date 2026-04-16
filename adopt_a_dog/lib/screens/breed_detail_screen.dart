import 'package:flutter/material.dart';
import '../models/breed.dart';
import '../services/dog_api_service.dart';
import '../services/prefs_service.dart';
import 'package:cached_network_image/cached_network_image.dart';

class BreedDetailScreen extends StatefulWidget {
  final Breed breed;
  const BreedDetailScreen({super.key, required this.breed});

  @override
  State<BreedDetailScreen> createState() => _BreedDetailScreenState();
}

class _BreedDetailScreenState extends State<BreedDetailScreen> {
  late Future<String> _imageFuture;
  String? _selectedSubBreed;
  final PrefsService _prefsService = PrefsService();

  @override
  void initState() {
    super.initState();
    _loadImage();
  }

  void _loadImage() {
    _imageFuture = DogApiService.fetchRandomImage(
      widget.breed.name,
      subBreed: _selectedSubBreed,
    );
  }

  void _saveFavorite() async {
    final nameToSave = widget.breed.displayName(sub: _selectedSubBreed);
    await _prefsService.addFavorite(nameToSave);
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('$nameToSave added to favorites!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.breed.displayName(sub: _selectedSubBreed)),
      ),
      body: Column(
        children: [
          if (widget.breed.subBreeds.isNotEmpty)
            SizedBox(
              height: 60,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: widget.breed.subBreeds.length,
                itemBuilder: (context, index) {
                  final sub = widget.breed.subBreeds[index];
                  final isSelected = _selectedSubBreed == sub;
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4.0, vertical: 8.0),
                    child: ChoiceChip(
                      label: Text(sub),
                      selected: isSelected,
                      onSelected: (selected) {
                        setState(() {
                          _selectedSubBreed = selected ? sub : null;
                          _loadImage(); 
                        });
                      },
                    ),
                  );
                },
              ),
            ),
          Expanded(
            child: FutureBuilder<String>(
              future: _imageFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return const Center(child: Text("Failed to load image"));
                } else if (snapshot.hasData) {
                  return Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: CachedNetworkImage(
                      imageUrl: snapshot.data!,
                      fit: BoxFit.contain,
                      progressIndicatorBuilder: (context, url, downloadProgress) =>
                          Center(child: CircularProgressIndicator(value: downloadProgress.progress)),
                      errorWidget: (context, url, error) => const Icon(Icons.error, size: 50),
                    ),
                  );
                }
                return const SizedBox.shrink();
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(bottom: 32.0, left: 16.0, right: 16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton.icon(
                  onPressed: () => setState(() => _loadImage()),
                  icon: const Icon(Icons.photo),
                  label: const Text("New Photo"),
                ),
                ElevatedButton.icon(
                  onPressed: _saveFavorite,
                  icon: const Icon(Icons.favorite),
                  label: const Text("Favorite"),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}