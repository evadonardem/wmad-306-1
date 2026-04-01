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
  // Store the Future once so rebuilds don't re-fetch.
  late final Future<List<Breed>> _breedsFuture;
  final _service = DogApiService();
  final _prefs = PrefsService();
  final _searchController = TextEditingController();

  String _search = '';

  @override
  void initState() {
    super.initState();
    _breedsFuture = _service.fetchBreeds();
    _loadSearchTerm();
  }

  Future<void> _loadSearchTerm() async {
    final saved = await _prefs.loadSearchTerm();
    if (saved != null) {
      setState(() {
        _search = saved;
        _searchController.text = saved;
      });
    }
  }

  Future<void> _saveSearchTerm(String term) async {
    await _prefs.saveSearchTerm(term);
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
        title: const Text('Choose a Breed'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: TextField(
              controller: _searchController,
              decoration: const InputDecoration(
                hintText: 'Search breed...',
                border: OutlineInputBorder(),
                filled: true,
                fillColor: Colors.white,
                prefixIcon: Icon(Icons.search),
              ),
              onChanged: (value) {
                setState(() {
                  _search = value.toLowerCase();
                });
                _saveSearchTerm(value);
              },
            ),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.favorite),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const FavoritesScreen(),
                ),
              );
            },
          ),
        ],
      ),

      body: FutureBuilder<List<Breed>>(
        future: _breedsFuture,
        builder: (context, snapshot) {
          // ① Still waiting
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          // ② Error
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          // ③ Data ready
          final allBreeds = snapshot.data!;
          final filteredBreeds = allBreeds
              .where((b) => b.name.toLowerCase().contains(_search))
              .toList();

          return filteredBreeds.isEmpty
              ? Center(
                  child: Text(
                    'No breeds match "$_search"',
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                )
              : ListView.builder(
                  itemCount: filteredBreeds.length,
                  itemBuilder: (context, index) {
                    final breed = filteredBreeds[index];
                    return ListTile(
                      leading: const Icon(Icons.pets),
                      title: Text(breed.name.toUpperCase()[0]
                          + breed.name.substring(1)),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => BreedDetailScreen(breed: breed),
                        ),
                      ),
                    );
                  },
                );
        },
      ),
    );
  }
}