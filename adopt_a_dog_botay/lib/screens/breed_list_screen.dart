import 'package:adopt_a_dog/models/breed.dart';
import 'package:adopt_a_dog/screens/breed_detail_screen.dart';
import 'package:adopt_a_dog/screens/favorites_screen.dart';
import 'package:adopt_a_dog/services/dog_api_service.dart';
import 'package:adopt_a_dog/services/prefs_service.dart';
import 'package:adopt_a_dog/services/theme_service.dart';
import 'package:flutter/material.dart';

import 'settings_screen.dart';

class BreedListScreen extends StatefulWidget {
  final ThemeModel? themeModel;

  const BreedListScreen({super.key, this.themeModel});

  @override
  State<BreedListScreen> createState() => _BreedListScreenState();
}

class _BreedListScreenState extends State<BreedListScreen> {
  final DogApiService _apiService = DogApiService();
  final PrefsService _prefsService = PrefsService();
  final TextEditingController _searchController = TextEditingController();

  late Future<List<Breed>> _breedsFuture;

  @override
  void initState() {
    super.initState();
    _breedsFuture = _apiService.fetchBreeds();

    _prefsService.loadSearchTerm().then((term) {
      if (!mounted || term == null) {
        return;
      }

      _searchController.text = term;
      setState(() {});
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _openBreed(Breed breed, {String? subBreed}) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => BreedDetailScreen(
          breed: breed,
          subBreed: subBreed,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: const Text('Choose a Breed'),
        backgroundColor: Colors.white.withValues(alpha: 0.10),
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () async {
              if (widget.themeModel == null) return;
              await Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => SettingsScreen(themeModel: widget.themeModel!),
                ),
              );
            },
            icon: const Icon(Icons.settings),
          ),
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
                    const Icon(Icons.error_outline, size: 48),
                    const SizedBox(height: 12),
                    Text(
                      'Could not load breeds.\n${snapshot.error}',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    FilledButton(
                      onPressed: () {
                        setState(() {
                          _breedsFuture = _apiService.fetchBreeds();
                        });
                      },
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            );
          }

          final breeds = snapshot.data ?? const <Breed>[];
          final query = _searchController.text.trim().toLowerCase();
          final filteredBreeds = query.isEmpty
              ? breeds
              : breeds.where((breed) {
                  if (breed.name.toLowerCase().contains(query)) {
                    return true;
                  }

                  return breed.subBreeds.any(
                    (subBreed) => subBreed.toLowerCase().contains(query),
                  );
                }).toList();

          if (breeds.isEmpty) {
            return const Center(child: Text('No breeds available'));
          }

          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                child: TextField(
                  controller: _searchController,
                  onChanged: (value) async {
                    await _prefsService.saveSearchTerm(value);
                    if (mounted) {
                      setState(() {});
                    }
                  },
                  decoration: InputDecoration(
                    hintText: 'Search breeds',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
              ),
              Expanded(
                child: filteredBreeds.isEmpty
                    ? const Center(child: Text('No breeds match your search'))
                    : ListView.separated(
                        padding: const EdgeInsets.all(16),
                        itemCount: filteredBreeds.length,
                        separatorBuilder: (context, index) =>
                            const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final breed = filteredBreeds[index];
                          final matchingSubBreeds = query.isEmpty
                              ? breed.subBreeds
                              : breed.subBreeds
                                  .where(
                                    (subBreed) => subBreed
                                        .toLowerCase()
                                        .contains(query),
                                  )
                                  .toList();

                          return Card(
                            child: ExpansionTile(
                              leading: const Icon(Icons.pets),
                              title: Text(_titleCase(breed.name)),
                              subtitle: Text(
                                breed.subBreeds.isEmpty
                                    ? 'No sub-breeds'
                                    : '${breed.subBreeds.length} sub-breeds',
                              ),
                              children: [
                                ListTile(
                                  title: const Text('View breed details'),
                                  trailing: const Icon(Icons.chevron_right),
                                  onTap: () => _openBreed(breed),
                                ),
                                ListTile(
                                  leading: const Icon(Icons.settings),
                                  title: const Text('Settings'),
                                  onTap: () async {
                                    if (widget.themeModel == null) return;
                                    await Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (_) => SettingsScreen(
                                          themeModel: widget.themeModel!,
                                        ),
                                      ),
                                    );
                                  },
                                ),
                                if (matchingSubBreeds.isNotEmpty)
                                  ...matchingSubBreeds.map(
                                    (subBreed) => ListTile(
                                      leading: const Icon(
                                        Icons.circle_outlined,
                                        size: 18,
                                      ),
                                      title: Text(breed.displayName(subBreed)),
                                      trailing: const Icon(Icons.chevron_right),
                                      onTap: () => _openBreed(
                                        breed,
                                        subBreed: subBreed,
                                      ),
                                    ),
                                  ),
                              ],
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
