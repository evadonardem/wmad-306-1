import 'package:adopt_a_dog/models/breed.dart';
import 'package:adopt_a_dog/screens/breed_detail_screen.dart';
import 'package:adopt_a_dog/screens/favorites_screen.dart';
import 'package:adopt_a_dog/services/dog_api_service.dart';
import 'package:adopt_a_dog/services/prefs_service.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

class BreedListScreen extends StatefulWidget {
  const BreedListScreen({super.key});

  @override
  State<BreedListScreen> createState() => _BreedListScreenState();
}

class _BreedListScreenState extends State<BreedListScreen> {
  late final Future<List<Breed>> _breedsFuture;
  final _service = DogApiService();
  final _prefs = PrefsService();
  final _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _breedsFuture = _service.fetchBreeds();
    _loadSearchTerm();
  }

  Future<void> _loadSearchTerm() async {
    final savedSearch = await _prefs.loadSearchTerm();

    if (!mounted) {
      return;
    }

    setState(() {
      _searchQuery = savedSearch;
      _searchController.text = savedSearch;
    });
  }

  Future<void> _updateSearchQuery(String value) async {
    final searchValue = value.trim();

    setState(() {
      _searchQuery = searchValue;
    });

    await _prefs.saveSearchTerm(searchValue);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Choose a Breed"),
        actions: [
          IconButton(
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const FavoritesScreen()),
            ),
            icon: const Icon(Icons.favorite),
          ),
        ],
      ),
      body: FutureBuilder<List<Breed>>(
        future: _breedsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final breeds = snapshot.data!;
          final filteredBreeds = breeds.where((breed) {
            return breed.name.toLowerCase().contains(
              _searchQuery.toLowerCase(),
            );
          }).toList();

          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                child: SearchBar(
                  controller: _searchController,
                  hintText: 'Search breeds',
                  leading: const Icon(Icons.search),
                  trailing: [
                    if (_searchQuery.isNotEmpty)
                      IconButton(
                        onPressed: () {
                          _searchController.clear();
                          _updateSearchQuery('');
                        },
                        icon: const Icon(Icons.clear),
                      ),
                  ],
                  elevation: WidgetStateProperty.all(0),
                  backgroundColor: WidgetStateProperty.all(
                    Theme.of(context).colorScheme.surface,
                  ),
                  side: WidgetStateProperty.all(
                    BorderSide(
                      color: Theme.of(context).colorScheme.outlineVariant,
                    ),
                  ),
                  padding: WidgetStateProperty.all(
                    const EdgeInsets.symmetric(horizontal: 16),
                  ),
                  onChanged: _updateSearchQuery,
                ),
              ),
              Expanded(
                child: filteredBreeds.isEmpty
                    ? const Center(child: Text('No breeds match your search.'))
                    : ListView.separated(
                        itemCount: filteredBreeds.length,
                        separatorBuilder: (context, index) {
                          return const Divider(height: 1);
                        },
                        itemBuilder: (context, index) {
                          final breed = filteredBreeds[index];
                          final name = breed.displayName();

                          return ListTile(
                            leading: _BreedThumbnail(
                              breed: breed,
                              service: _service,
                            ),
                            title: Text(name),
                            trailing: const Icon(Icons.chevron_right),
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => BreedDetailScreen(breed: breed),
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _BreedThumbnail extends StatefulWidget {
  final Breed breed;
  final DogApiService service;

  const _BreedThumbnail({required this.breed, required this.service});

  @override
  State<_BreedThumbnail> createState() => _BreedThumbnailState();
}

class _BreedThumbnailState extends State<_BreedThumbnail> {
  late final Future<String> _imageFuture;

  @override
  void initState() {
    super.initState();
    _imageFuture = widget.service.fetchRandomImage(widget.breed.name);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String>(
      future: _imageFuture,
      builder: (context, imageSnapshot) {
        if (!imageSnapshot.hasData) {
          return const CircleAvatar(child: Icon(Icons.pets));
        }

        return ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: CachedNetworkImage(
            imageUrl: imageSnapshot.data!,
            width: 44,
            height: 44,
            fit: BoxFit.cover,
            placeholder: (context, url) {
              return Container(
                width: 44,
                height: 44,
                color: Theme.of(context).colorScheme.surfaceContainerHighest,
                child: const Icon(Icons.pets),
              );
            },
            errorWidget: (context, url, error) {
              return Container(
                width: 44,
                height: 44,
                color: Theme.of(context).colorScheme.surfaceContainerHighest,
                child: const Icon(Icons.pets),
              );
            },
          ),
        );
      },
    );
  }
}
