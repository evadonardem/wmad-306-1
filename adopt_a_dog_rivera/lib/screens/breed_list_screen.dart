import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/breed.dart';
import '../services/dog_api_service.dart';
import '../services/prefs_service.dart';
import '../widgets/logo_hero_section.dart';
import 'breed_detail_screen.dart';
import '../utils/responsive.dart';

class BreedListScreen extends StatefulWidget {
  const BreedListScreen({super.key});
  @override
  State<BreedListScreen> createState() => _BreedListScreenState();
}

class _BreedListScreenState extends State<BreedListScreen> {
  late final Future<List<Breed>> _breedsFuture;
  final _service = DogApiService();
  final _prefs = PrefsService();
  late TextEditingController _searchController;
  String _searchTerm = '';

  @override
  void initState() {
    super.initState();
    _breedsFuture = _service.fetchBreeds();
    _searchController = TextEditingController();
    _loadLastSearchTerm();
  }

  Future<void> _loadLastSearchTerm() async {
    final lastSearch = await _getLastSearch();
    if (mounted) {
      setState(() {
        _searchTerm = lastSearch;
        _searchController.text = lastSearch;
      });
    }
  }

  Future<String> _getLastSearch() async {
    final prefs = await _prefs.getInstance();
    return prefs.getString('lastSearch') ?? '';
  }

  Future<void> _saveSearchTerm(String term) async {
    final prefs = await _prefs.getInstance();
    await prefs.setString('lastSearch', term);
  }

  void _updateSearchTerm(String value) {
    setState(() {
      _searchTerm = value;
    });
    _saveSearchTerm(value);
  }

  void _clearSearch() {
    _searchController.clear();
    _updateSearchTerm('');
  }

  List<Breed> _filterBreeds(List<Breed> allBreeds) {
    if (_searchTerm.isEmpty) {
      return allBreeds;
    }
    return allBreeds
        .where(
          (breed) =>
              breed.name.toLowerCase().contains(_searchTerm.toLowerCase()),
        )
        .toList();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final crossAxisCount = calculateGridCount(
      context,
      minItemWidth: 260,
      minCount: 2,
      maxCount: 6,
    );

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        automaticallyImplyLeading: false,
        toolbarHeight: 76,
        title: LayoutBuilder(
          builder: (context, constraints) {
            final maxSearchWidth = constraints.maxWidth > 900 ? 720.0 : 360.0;
            return Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: Colors.white70, width: 1.4),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.asset(
                      'assets/FurEverHome.png',
                      height: 40,
                      width: 40,
                      errorBuilder: (context, error, stackTrace) =>
                          const Icon(Icons.pets, size: 40),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                const Text(
                  'FurEverHome',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                ),
                const SizedBox(width: 18),
                Flexible(
                  child: ConstrainedBox(
                    constraints: BoxConstraints(maxWidth: maxSearchWidth),
                    child: SizedBox(
                      height: 38,
                      child: TextField(
                        controller: _searchController,
                        onChanged: _updateSearchTerm,
                        decoration: InputDecoration(
                          contentPadding: const EdgeInsets.symmetric(
                            vertical: 10,
                          ),
                          hintText: 'Search dog breeds...',
                          hintStyle: TextStyle(color: Colors.grey[200]),
                          prefixIcon: Icon(Icons.search, color: Colors.white70),
                          suffixIcon: _searchTerm.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(
                                    Icons.close,
                                    color: Colors.white70,
                                  ),
                                  onPressed: _clearSearch,
                                )
                              : null,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(14),
                            borderSide: BorderSide.none,
                          ),
                          filled: true,
                          fillColor: Colors.white.withOpacity(0.14),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
      body: FutureBuilder<List<Breed>>(
        future: _breedsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(
                    color: Theme.of(context).primaryColor,
                    strokeWidth: 4,
                  ),
                  const SizedBox(height: 16),
                  const Text('Loading dog breeds...'),
                ],
              ),
            );
          }

          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  'Error: ${snapshot.error}',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.red,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            );
          }

          final allBreeds = snapshot.data!;
          final filteredBreeds = _filterBreeds(allBreeds);

          return SingleChildScrollView(
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 1200),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const LogoHeroSection(),
                    const SizedBox(height: 24),
                    // Most Popular Dogs Section
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '🌟 Most Popular Dogs',
                            style: Theme.of(context).textTheme.titleLarge
                                ?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: const Color(0xFF264653),
                                ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Discover the most loved dog breeds in our community',
                            style: Theme.of(context).textTheme.bodySmall
                                ?.copyWith(color: Colors.grey[600]),
                          ),
                          const SizedBox(height: 12),
                          // Top popular breeds Horizontal Scroll
                          SizedBox(
                            height: 240,
                            child: ListView.separated(
                              scrollDirection: Axis.horizontal,
                              itemCount: 9,
                              separatorBuilder: (_, _) =>
                                  const SizedBox(width: 12),
                              itemBuilder: (context, index) {
                                final popularNames = [
                                  'German',
                                  'Retriever',
                                  'Beagle',
                                  'Bulldog',
                                  'Poodle',
                                  'Dachshund',
                                  'Husky',
                                  'Boxer',
                                  'Chihuahua',
                                ];
                                final activeName = popularNames[index]
                                    .toLowerCase();
                                final breed = allBreeds.firstWhere(
                                  (b) => b.name.toLowerCase() == activeName,
                                  orElse: () =>
                                      Breed(name: activeName, subBreeds: []),
                                );
                                return SizedBox(
                                  width: 160,
                                  child: _PetCard(
                                    breed: breed,
                                    onTap: () => Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (_) =>
                                            BreedDetailScreen(breed: breed),
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    // All Breeds Section
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'All Breeds',
                            style: Theme.of(context).textTheme.titleLarge
                                ?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: const Color(0xFF264653),
                                ),
                          ),
                          const SizedBox(height: 12),
                        ],
                      ),
                    ),
                    const SizedBox(height: 18),
                    if (filteredBreeds.isEmpty && _searchTerm.isNotEmpty)
                      Center(
                        child: Padding(
                          padding: const EdgeInsets.all(32.0),
                          child: Column(
                            children: [
                              Icon(
                                Icons.search_off,
                                size: 64,
                                color: Colors.grey[400],
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'No breeds found',
                                style: Theme.of(context).textTheme.titleMedium,
                              ),
                            ],
                          ),
                        ),
                      )
                    else
                      Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16.0,
                          vertical: 8.0,
                        ),
                        child: GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate:
                              SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: crossAxisCount,
                                childAspectRatio: 1,
                                crossAxisSpacing: 16,
                                mainAxisSpacing: 16,
                              ),
                          itemCount: filteredBreeds.length,
                          itemBuilder: (context, index) {
                            final breed = filteredBreeds[index];
                            return _PetCard(
                              breed: breed,
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) =>
                                      BreedDetailScreen(breed: breed),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

/// Pet card widget showing breed with circular image
class _PetCard extends StatefulWidget {
  final Breed breed;
  final VoidCallback onTap;

  const _PetCard({required this.breed, required this.onTap});

  @override
  State<_PetCard> createState() => _PetCardState();
}

class _PetCardState extends State<_PetCard> {
  late Future<String> _imageFuture;

  @override
  void initState() {
    super.initState();
    _imageFuture = DogApiService().fetchRandomImage(widget.breed.name);
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Colors.purple.shade100, Colors.purple.shade50],
            ),
          ),
          child: FutureBuilder<String>(
            future: _imageFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState != ConnectionState.done) {
                return Center(
                  child: CircularProgressIndicator(
                    color: Theme.of(context).primaryColor,
                  ),
                );
              }

              if (!snapshot.hasData && snapshot.hasError) {
                return Center(
                  child: Icon(Icons.error, color: Colors.grey[400], size: 40),
                );
              }

              final imageUrl = snapshot.data ?? '';
              return Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Circular image with purple border
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: Theme.of(context).primaryColor,
                        width: 4,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Theme.of(
                            context,
                          ).primaryColor.withOpacity(0.3),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ClipOval(
                      child: CachedNetworkImage(
                        imageUrl: imageUrl,
                        fit: BoxFit.cover,
                        placeholder: (context, url) => Container(
                          color: Colors.grey[300],
                          child: Center(
                            child: CircularProgressIndicator(
                              color: Theme.of(context).primaryColor,
                            ),
                          ),
                        ),
                        errorWidget: (context, url, error) => Container(
                          color: Colors.grey[300],
                          child: Icon(
                            Icons.pets,
                            color: Colors.grey[500],
                            size: 40,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Breed name
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8.0),
                    child: Text(
                      widget.breed.name.toUpperCase()[0] +
                          widget.breed.name.substring(1),
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  // Sub-breeds count
                  if (widget.breed.subBreeds.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8.0,
                        vertical: 4.0,
                      ),
                      child: Text(
                        '${widget.breed.subBreeds.length} variants',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Colors.grey[600],
                        ),
                      ),
                    ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }
}
