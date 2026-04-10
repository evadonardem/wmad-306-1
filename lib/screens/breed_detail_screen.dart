import 'package:flutter/material.dart';
import '../models/breed.dart';
import '../services/dog_api_service.dart';
import '../services/prefs_service.dart';

class DogProfile {
  final String name;
  final String age;
  final String temperament;
  final String status;

  const DogProfile({
    required this.name,
    required this.age,
    required this.temperament,
    required this.status,
  });
}

const List<DogProfile> _profiles = [
  DogProfile(
    name: 'Buddy',
    age: '1 year',
    temperament: 'Curious, energetic, affectionate',
    status: 'Ready for adoption',
  ),
  DogProfile(
    name: 'Luna',
    age: '2 years',
    temperament: 'Friendly, playful, loyal',
    status: 'Available for adoption',
  ),
  DogProfile(
    name: 'Max',
    age: '3 years',
    temperament: 'Calm, confident, gentle',
    status: 'Waiting for a forever home',
  ),
  DogProfile(
    name: 'Daisy',
    age: '10 months',
    temperament: 'Sweet, social, curious',
    status: 'Adoption interview open',
  ),
  DogProfile(
    name: 'Rocky',
    age: '4 years',
    temperament: 'Protective, smart, devoted',
    status: 'Great match for active families',
  ),
];

class BreedDetailScreen extends StatefulWidget {
  final Breed breed;
  const BreedDetailScreen({super.key, required this.breed});

  @override
  State<BreedDetailScreen> createState() => BreedDetailScreenState();
}

class BreedDetailScreenState extends State<BreedDetailScreen> {
  late Future<String> imageFuture;
  final _api = DogApiService();
  final prefs = PrefsService();
  bool saved = false;
  late int _profileIndex;

  DogProfile get _profile => _profiles[_profileIndex % _profiles.length];

  @override
  void initState() {
    super.initState();
    imageFuture = _api.fetchRandomImage(widget.breed.name);
    _profileIndex = widget.breed.name.hashCode.abs() % _profiles.length;
  }

  void refresh() {
    setState(() {
      imageFuture = _api.fetchRandomImage(widget.breed.name);
      saved = false;
      _profileIndex = (_profileIndex + 1) % _profiles.length;
    });
  }

  Future<void> saveFavorite() async {
    await prefs.saveFavorite(widget.breed.name);
    setState(() => saved = true);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('${widget.breed.name} saved!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.breed.name)),
      body: FutureBuilder<String>(
        future: imageFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('${snapshot.error}'));
          }
          final url = snapshot.data!;
          return LayoutBuilder(
            builder: (context, constraints) {
              final maxImageHeight = constraints.maxWidth >= 1000
                  ? 420.0
                  : constraints.maxHeight * 0.45;

              return SingleChildScrollView(
                child: Column(
                  children: [
                    Container(
                      width: double.infinity,
                      constraints: BoxConstraints(maxHeight: maxImageHeight),
                      color: Theme.of(context).colorScheme.surfaceContainerHighest,
                      child: AspectRatio(
                        aspectRatio: 4 / 3,
                        child: Image.network(
                          url,
                          loadingBuilder: (ctx, child, progress) =>
                              progress == null
                                  ? child
                                  : const Center(
                                      child: CircularProgressIndicator(),
                                    ),
                          errorBuilder: (ctx, _, __) =>
                              const Icon(Icons.broken_image, size: 64),
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.breed.displayName(),
                            style: Theme.of(context).textTheme.headlineMedium,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Name: ${_profile.name}',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Age: ${_profile.age}\n'
                            'Temperament: ${_profile.temperament}\n'
                            'Status: ${_profile.status}',
                            style: Theme.of(context).textTheme.bodyLarge,
                          ),
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              ElevatedButton.icon(
                                onPressed: refresh,
                                icon: const Icon(Icons.navigate_next),
                                label: const Text('Next'),
                              ),
                              ElevatedButton.icon(
                                onPressed: saved ? null : saveFavorite,
                                icon: Icon(saved
                                    ? Icons.favorite
                                    : Icons.favorite_border),
                                label: const Text('Favorite'),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}
