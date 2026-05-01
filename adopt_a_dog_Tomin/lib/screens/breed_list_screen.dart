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
                    : ListView.builder(
                        padding: const EdgeInsets.only(bottom: 16),
                        itemCount: filteredBreeds.length,
                        itemBuilder: (context, index) {
                          final breed = filteredBreeds[index];
                          return _BreedCard(
                            breed: breed,
                            service: _service,
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

class _BreedCard extends StatefulWidget {
  final Breed breed;
  final DogApiService service;
  final VoidCallback onTap;

  const _BreedCard({
    required this.breed,
    required this.service,
    required this.onTap,
  });

  @override
  State<_BreedCard> createState() => _BreedCardState();
}

class _BreedCardState extends State<_BreedCard> {
  bool _hovering = false;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final name = widget.breed.displayName();
    final subtitle = widget.breed.subBreeds.isNotEmpty
        ? '${widget.breed.subBreeds.length} sub-breed${widget.breed.subBreeds.length == 1 ? '' : 's'}'
        : 'No sub-breeds available';

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: MouseRegion(
        onEnter: (_) => setState(() => _hovering = true),
        onExit: (_) => setState(() => _hovering = false),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          curve: Curves.easeInOut,
          decoration: BoxDecoration(
            color: _hovering
                ? colorScheme.surfaceContainerHighest
                : Theme.of(context).cardColor,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Color.fromARGB(_hovering ? 31 : 10, 0, 0, 0),
                blurRadius: _hovering ? 18 : 8,
                spreadRadius: _hovering ? 1 : 0,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: widget.onTap,
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    _BreedThumbnail(
                      breed: widget.breed,
                      service: widget.service,
                    ),
                    const SizedBox(width: 18),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            name,
                            style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w700,
                              color: colorScheme.onSurface,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            subtitle,
                            style: TextStyle(
                              fontSize: 14,
                              color: colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Icon(
                      Icons.chevron_right_rounded,
                      color: colorScheme.primary,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
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
          return CircleAvatar(
            radius: 28,
            backgroundColor: Theme.of(context).colorScheme.surfaceContainerHighest,
            child: const Icon(Icons.pets, color: Colors.white),
          );
        }

        return ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: CachedNetworkImage(
            imageUrl: imageSnapshot.data!,
            width: 56,
            height: 56,
            fit: BoxFit.cover,
            placeholder: (context, url) {
              return Container(
                width: 56,
                height: 56,
                color: Theme.of(context).colorScheme.surfaceContainerHighest,
                child: const Icon(Icons.pets, color: Colors.white),
              );
            },
            errorWidget: (context, url, error) {
              return Container(
                width: 56,
                height: 56,
                color: Theme.of(context).colorScheme.surfaceContainerHighest,
                child: const Icon(Icons.pets, color: Colors.white),
              );
            },
          ),
        );
      },
    );
  }
}

