import 'package:flutter/material.dart';
import '../models/breed.dart';
import '../services/dog_api_service.dart';
import 'breed_detail_screen.dart';
import 'favorites_screen.dart';

class BreedListScreen extends StatefulWidget {
  const BreedListScreen({super.key});

  @override
  State<BreedListScreen> createState() => BreedListScreenState();
}

class BreedListScreenState extends State<BreedListScreen> {
  late final Future<List<Breed>> breedsFuture;
  final _service = DogApiService();
  String searchTerm = '';

  @override
  void initState() {
    super.initState();
    breedsFuture = _service.fetchBreeds();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Choose a Breed'),
        actions: [
          IconButton(
            icon: const Icon(Icons.favorite),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const FavoritesScreen()),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8),
            child: TextField(
              decoration: const InputDecoration(
                hintText: 'Search breeds...',
                prefixIcon: Icon(Icons.search),
              ),
              onChanged: (val) => setState(() => searchTerm = val.toLowerCase()),
            ),
          ),
          Expanded(
            child: FutureBuilder<List<Breed>>(
              future: breedsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState != ConnectionState.done) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                }
                final breeds = snapshot.data!
                    .where((b) => b.name.toLowerCase().contains(searchTerm))
                    .toList();
                return ListView.builder(
                  itemCount: breeds.length,
                  itemBuilder: (context, index) {
                    final breed = breeds[index];
                    return ListTile(
                      leading: const Icon(Icons.pets),
                      title: Text(
                        breed.name[0].toUpperCase() + breed.name.substring(1),
                      ),
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
          ),
        ],
      ),
    );
  }
}
