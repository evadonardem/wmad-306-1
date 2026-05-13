import 'package:cached_network_image/cached_network_image.dart';
import 'package:adopt_a_dog/models/favorite_dog.dart';
import 'package:adopt_a_dog/screens/favorite_detail_screen.dart';
import 'package:adopt_a_dog/services/breed_info_service.dart';
import 'package:adopt_a_dog/services/prefs_service.dart';
import 'package:flutter/material.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  late Future<List<FavoriteDog>> _favoritesFuture;
  late Future<Map<String, String>> _breedDescriptionsFuture;
  final _prefs = PrefsService();
  final _breedInfoService = BreedInfoService();
  final _searchController = TextEditingController();
  String _searchQuery = '';
  String? _selectedBreed;

  @override
  void initState() {
    super.initState();
    _favoritesFuture = _prefs.loadFavorites();
    _breedDescriptionsFuture = _breedInfoService.fetchBreedDescriptions();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _removeFavorite(int index) async {
    await _prefs.removeFavoriteAt(index);

    if (!mounted) {
      return;
    }

    setState(() {
      _favoritesFuture = _prefs.loadFavorites();
    });

    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Favorite removed')));
  }

  Future<void> _openFavoriteDetail(
    FavoriteDog favorite,
    String description,
    int originalIndex,
    List<FavoriteDog> favorites,
    Map<String, String> descriptions,
  ) async {
    final groupedFavorites = favorites
        .asMap()
        .entries
        .where((entry) {
          final item = entry.value;
          return item.breedName == favorite.breedName &&
              item.subBreed == favorite.subBreed;
        })
        .map(
          (entry) => FavoriteDetailEntry(
            favorite: entry.value,
            description: _breedInfoService.descriptionForFavorite(
              entry.value,
              descriptions,
            ),
            originalIndex: entry.key,
          ),
        )
        .toList();
    final initialDetailIndex = groupedFavorites.indexWhere(
      (entry) => entry.originalIndex == originalIndex,
    );

    final deleted = await Navigator.push<bool>(
      context,
      MaterialPageRoute(
        builder: (_) => FavoriteDetailScreen(
          entries: groupedFavorites,
          initialIndex: initialDetailIndex < 0 ? 0 : initialDetailIndex,
          onDelete: (indexToDelete) => _prefs.removeFavoriteAt(indexToDelete),
        ),
      ),
    );

    if (deleted == true && mounted) {
      setState(() {
        _favoritesFuture = _prefs.loadFavorites();
      });

      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Favorite removed')));
    }
  }

  List<FavoriteDog> _filterFavorites(List<FavoriteDog> favorites) {
    final query = _searchQuery.toLowerCase();

    return favorites.where((favorite) {
      final matchesBreed =
          _selectedBreed == null || favorite.breedName == _selectedBreed;
      final matchesSearch =
          favorite.displayName.toLowerCase().contains(query) ||
          favorite.breedName.toLowerCase().contains(query);
      return matchesBreed && matchesSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFF171717),
      appBar: AppBar(title: const Text('My Favorites')),
      body: FutureBuilder<List<FavoriteDog>>(
        future: _favoritesFuture,
        builder: (context, prefSnapshot) {
          if (prefSnapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          if (prefSnapshot.hasError) {
            return Center(child: Text('${prefSnapshot.error}'));
          }

          final favorites = prefSnapshot.data ?? [];
          final breeds =
              favorites.map((favorite) => favorite.breedName).toSet().toList()
                ..sort();
          final filteredFavorites = _filterFavorites(favorites);

          if (favorites.isEmpty) {
            return const Center(
              child: Text(
                'No favorites saved yet!\nTap Add Favorite on any breed photo.',
                style: TextStyle(color: Colors.white70),
              ),
            );
          }

          return FutureBuilder<Map<String, String>>(
            future: _breedDescriptionsFuture,
            builder: (context, descriptionSnapshot) {
              final descriptions =
                  descriptionSnapshot.data ?? const <String, String>{};

              return Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
                    child: SearchBar(
                      controller: _searchController,
                      hintText: 'Search favorites',
                      leading: const Icon(Icons.search),
                      trailing: [
                        if (_searchQuery.isNotEmpty)
                          IconButton(
                            onPressed: () {
                              _searchController.clear();
                              setState(() {
                                _searchQuery = '';
                              });
                            },
                            icon: const Icon(Icons.clear),
                          ),
                      ],
                      elevation: WidgetStateProperty.all(0),
                      backgroundColor: WidgetStateProperty.all(
                        const Color(0xFF242424),
                      ),
                      side: WidgetStateProperty.all(
                        const BorderSide(color: Color(0xFF3A3A3A)),
                      ),
                      hintStyle: WidgetStateProperty.all(
                        const TextStyle(color: Colors.white54),
                      ),
                      textStyle: WidgetStateProperty.all(
                        const TextStyle(color: Colors.white),
                      ),
                      padding: WidgetStateProperty.all(
                        const EdgeInsets.symmetric(horizontal: 16),
                      ),
                      onChanged: (value) {
                        setState(() {
                          _searchQuery = value.trim();
                        });
                      },
                    ),
                  ),
                  SizedBox(
                    height: 52,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: FilterChip(
                            label: const Text('All Breeds'),
                            selected: _selectedBreed == null,
                            onSelected: (_) {
                              setState(() {
                                _selectedBreed = null;
                              });
                            },
                            labelStyle: TextStyle(
                              color: _selectedBreed == null
                                  ? Colors.white
                                  : Colors.white70,
                            ),
                            backgroundColor: const Color(0xFF242424),
                            selectedColor: theme.colorScheme.primary,
                            side: const BorderSide(color: Color(0xFF3A3A3A)),
                            showCheckmark: false,
                          ),
                        ),
                        ...breeds.map(
                          (breed) => Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: FilterChip(
                              label: Text(
                                breed[0].toUpperCase() + breed.substring(1),
                              ),
                              selected: _selectedBreed == breed,
                              onSelected: (_) {
                                setState(() {
                                  _selectedBreed = _selectedBreed == breed
                                      ? null
                                      : breed;
                                });
                              },
                              labelStyle: TextStyle(
                                color: _selectedBreed == breed
                                    ? Colors.white
                                    : Colors.white70,
                              ),
                              backgroundColor: const Color(0xFF242424),
                              selectedColor: theme.colorScheme.primary,
                              side: const BorderSide(color: Color(0xFF3A3A3A)),
                              showCheckmark: false,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  Expanded(
                    child: filteredFavorites.isEmpty
                        ? const Center(
                            child: Text(
                              'No favorites match your filters.',
                              style: TextStyle(color: Colors.white70),
                            ),
                          )
                        : LayoutBuilder(
                            builder: (context, constraints) {
                              final crossAxisCount =
                                  constraints.maxWidth >= 1200
                                  ? 4
                                  : constraints.maxWidth >= 900
                                  ? 3
                                  : constraints.maxWidth >= 600
                                  ? 2
                                  : 1;

                              return GridView.builder(
                                padding: const EdgeInsets.fromLTRB(
                                  16,
                                  0,
                                  16,
                                  16,
                                ),
                                gridDelegate:
                                    SliverGridDelegateWithFixedCrossAxisCount(
                                      crossAxisCount: crossAxisCount,
                                      crossAxisSpacing: 16,
                                      mainAxisSpacing: 16,
                                      childAspectRatio: 0.92,
                                    ),
                                itemCount: filteredFavorites.length,
                                itemBuilder: (context, index) {
                                  final favorite = filteredFavorites[index];
                                  final originalIndex = favorites.indexOf(
                                    favorite,
                                  );
                                  final description = _breedInfoService
                                      .descriptionForFavorite(
                                        favorite,
                                        descriptions,
                                      );

                                  return _FavoriteGalleryCard(
                                    favorite: favorite,
                                    description: description,
                                    onTap: () => _openFavoriteDetail(
                                      favorite,
                                      description,
                                      originalIndex,
                                      favorites,
                                      descriptions,
                                    ),
                                    onDelete: () =>
                                        _removeFavorite(originalIndex),
                                  );
                                },
                              );
                            },
                          ),
                  ),
                ],
              );
            },
          );
        },
      ),
    );
  }
}

class _FavoriteGalleryCard extends StatelessWidget {
  final FavoriteDog favorite;
  final String description;
  final VoidCallback onTap;
  final VoidCallback onDelete;

  const _FavoriteGalleryCard({
    required this.favorite,
    required this.description,
    required this.onTap,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFF242424),
      borderRadius: BorderRadius.circular(20),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Ink(
          decoration: BoxDecoration(
            color: const Color(0xFF242424),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                child: Stack(
                  children: [
                    Positioned.fill(
                      child: CachedNetworkImage(
                        imageUrl: favorite.imageUrl,
                        fit: BoxFit.cover,
                        placeholder: (context, url) {
                          return const Center(
                            child: CircularProgressIndicator(),
                          );
                        },
                        errorWidget: (context, url, error) {
                          return const Center(
                            child: Icon(
                              Icons.broken_image,
                              size: 48,
                              color: Colors.white70,
                            ),
                          );
                        },
                      ),
                    ),
                    Positioned(
                      top: 10,
                      right: 10,
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.55),
                          shape: BoxShape.circle,
                        ),
                        child: IconButton(
                          onPressed: onDelete,
                          icon: const Icon(Icons.delete, color: Colors.white),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      favorite.displayName,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
