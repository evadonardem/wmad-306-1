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

const List<String> _firstNames = [
  'Buddy', 'Luna', 'Max', 'Daisy', 'Rocky', 'Milo', 'Bella', 'Cooper',
  'Sadie', 'Teddy', 'Nala', 'Finn', 'Ruby', 'Leo', 'Penny', 'Zeus',
  'Maya', 'Ollie', 'Hazel', 'Bruno', 'Willow', 'Ace', 'Rosie', 'Archie',
  'Nova', 'Jasper', 'Skye', 'Benny', 'Zara', 'Chase',
];

const List<String> _ages = [
  '8 months', '1 year', '2 years', '3 years', '4 years', '5 years',
];

const List<String> _temperaments = [
  'Friendly, playful, loyal',
  'Curious, energetic, affectionate',
  'Calm, confident, gentle',
  'Sweet, social, curious',
  'Smart, alert, devoted',
  'Easygoing, cuddly, patient',
];

const List<String> _statuses = [
  'Available for adoption',
  'Ready to meet families',
  'Waiting for a forever home',
  'Adoption interview open',
  'Looking for an active home',
  'Best with a fenced yard',
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
  late DogProfile _profile;
  int _profileSeed = 0;

  DogProfile _buildProfile() {
    _profileSeed += 1;
    final first = _firstNames[_profileSeed % _firstNames.length];

    return DogProfile(
      name: first,
      age: _ages[_profileSeed % _ages.length],
      temperament: _temperaments[_profileSeed % _temperaments.length],
      status: _statuses[_profileSeed % _statuses.length],
    );
  }

  @override
  void initState() {
    super.initState();
    imageFuture = _api.fetchRandomImage(widget.breed.name);
    _profileSeed = widget.breed.name.hashCode.abs();
    _profile = _buildProfile();
  }

  void refresh() {
    setState(() {
      imageFuture = _api.fetchRandomImage(widget.breed.name);
      saved = false;
      _profile = _buildProfile();
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
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          AspectRatio(
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
                          Positioned(
                            left: 12,
                            right: 12,
                            bottom: 12,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 10,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.black.withValues(alpha: 0.55),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text(
                                'Meet ${_profile.name}',
                                style: Theme.of(context)
                                    .textTheme
                                    .titleMedium
                                    ?.copyWith(color: Colors.white),
                              ),
                            ),
                          ),
                        ],
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
