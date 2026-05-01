import 'package:flutter/material.dart';
import '../models/breed.dart';
import '../services/dog_api_service.dart';
import '../services/prefs_service.dart';
import 'breed_detail_screen.dart';
import 'favorites_screen.dart';

class BreedListScreen extends StatefulWidget {
  const BreedListScreen({super.key});

  @override
  State<BreedListScreen> createState() => _BreedListScreenState();
}

class _BreedListScreenState extends State<BreedListScreen> {
  late Future<List<Breed>> _breedsFuture;
  final DogApiService _api = DogApiService();
  final PrefsService _prefs = PrefsService();

  late TextEditingController _controller;

  String _searchQuery = '';
  List<Breed> _allBreeds = [];

  @override
  void initState() {
    super.initState();
    _breedsFuture = _api.fetchBreeds();

    _controller = TextEditingController();

    _loadSearch();
  }

  void _loadSearch() async {
    final saved = await _prefs.loadSearch();
    if (saved != null) {
      setState(() {
        _searchQuery = saved;
        _controller.text = saved;
      });
    }
  }

  @override
  void dispose() {
    _controller.dispose();
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
              MaterialPageRoute(
                builder: (_) => const FavoritesScreen(),
              ),
            ),
            icon: const Icon(Icons.favorite),
          ),
        ],
      ),
      body: Column(
        children: [
          // 🔍 SEARCH BAR
          Padding(
            padding: const EdgeInsets.all(8),
            child: TextField(
              controller: _controller,
              decoration: InputDecoration(
                hintText: 'Search breed...',
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
              onChanged: (value) {
                setState(() {
                  _searchQuery = value;
                });

                _prefs.saveSearch(value);
              },
            ),
          ),

          // 📋 LIST
          Expanded(
            child: FutureBuilder<List<Breed>>(
              future: _breedsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState != ConnectionState.done) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                }

                _allBreeds = snapshot.data!;

                final filteredBreeds = _allBreeds.where((breed) {
                  return breed.name
                      .toLowerCase()
                      .contains(_searchQuery.toLowerCase());
                }).toList();

                return ListView.builder(
                  itemCount: filteredBreeds.length,
                  itemBuilder: (context, index) {
                    final breed = filteredBreeds[index];

                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      child: Card(
                        child: ListTile(
                          leading: Hero(
                            tag: breed.name,
                            child: const CircleAvatar(
                              child: Icon(Icons.pets),
                            ),
                          ),
                          title: Text(
                            breed.name[0].toUpperCase() +
                                breed.name.substring(1),
                            style: const TextStyle(fontWeight: FontWeight.w600),
                          ),
                          trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                          onTap: () {
                            Navigator.push(
                              context,
                              PageRouteBuilder(
                                pageBuilder: (_, __, ___) =>
                                    BreedDetailScreen(breed: breed),
                                transitionsBuilder: (_, animation, __, child) {
                                  return FadeTransition(
                                    opacity: animation,
                                    child: SlideTransition(
                                      position: Tween<Offset>(
                                        begin: const Offset(0, 0.2),
                                        end: Offset.zero,
                                      ).animate(animation),
                                      child: child,
                                    ),
                                  );
                                },
                              ),
                            );
                          },
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}