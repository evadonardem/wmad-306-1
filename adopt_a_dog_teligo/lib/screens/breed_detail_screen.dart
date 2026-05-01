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
  final DogApiService _api = DogApiService();
  final PrefsService _prefs = PrefsService();

  bool _saved = false;
  String? _selectedSubBreed;

  @override
  void initState() {
    super.initState();
    _loadImage();
  }

  void _loadImage() {
    final breedPath = _selectedSubBreed != null
        ? '${widget.breed.name}/$_selectedSubBreed'
        : widget.breed.name;

    _imageFuture = _api.fetchRandomImage(breedPath);
  }

  void _refresh() {
    setState(() {
      _loadImage();
      _saved = false;
    });
  }

  Future<void> _saveFavorite() async {
    await _prefs.saveFavorite(widget.breed.name);

    setState(() => _saved = true);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('${widget.breed.name} saved!')),
      );
    }
  }

  void _selectSubBreed(String sub) {
    setState(() {
      _selectedSubBreed = sub;
      _loadImage();
      _saved = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final hasSubBreeds = widget.breed.subBreeds.isNotEmpty;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.breed.name),
      ),
      body: Column(
        children: [
          // ⭐ SUB-BREED CHIPS
          if (hasSubBreeds)
            SizedBox(
              height: 60,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: widget.breed.subBreeds.map((sub) {
                  final isSelected = sub == _selectedSubBreed;

                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 10),
                    child: ChoiceChip(
                      label: Text(sub),
                      selected: isSelected,
                      onSelected: (_) => _selectSubBreed(sub),
                    ),
                  );
                }).toList(),
              ),
            ),

          // 🖼 IMAGE WITH HERO ANIMATION
          Expanded(
            child: FutureBuilder<String>(
              future: _imageFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState != ConnectionState.done) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (snapshot.hasError) {
                  return Center(child: Text('${snapshot.error}'));
                }

                return Hero(
                  tag: widget.breed.name,
                  child: CachedNetworkImage(
                    imageUrl: snapshot.data!,
                    fit: BoxFit.cover,
                    width: double.infinity,
                    placeholder: (context, url) =>
                        const Center(child: CircularProgressIndicator()),
                    errorWidget: (context, url, error) =>
                        const Icon(Icons.broken_image, size: 64),
                  ),
                );
              },
            ),
          ),

          // 🔘 BUTTONS (slightly improved style)
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                  ),
                  onPressed: _refresh,
                  icon: const Icon(Icons.refresh),
                  label: const Text("New"),
                ),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                  ),
                  onPressed: _saved ? null : _saveFavorite,
                  icon: Icon(
                    _saved ? Icons.favorite : Icons.favorite_border,
                  ),
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