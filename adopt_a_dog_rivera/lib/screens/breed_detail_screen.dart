import 'package:flutter/material.dart';
import '../models/breed.dart';
import '../services/dog_api_service.dart';
import '../services/prefs_service.dart';

class BreedDetailScreen extends StatefulWidget {
  final Breed breed;

  const BreedDetailScreen({super.key, required this.breed});

  @override
  State<BreedDetailScreen> createState() => _BreedDetailScreenState();
}

class _BreedDetailScreenState extends State<BreedDetailScreen> {
  final _api = DogApiService();
  final _prefs = PrefsService();
  List<String> _subBreeds = [];
  late final List<String> _imagePaths;
  late final List<Future<String>> _imageFutures;
  late List<List<String>> _subBreedDogNames;
  late List<int> _currentDogIndexes;
  int _currentSubBreedIndex = 0;
  bool _isFavorite = false;

  bool get _hasSubBreeds => widget.breed.subBreeds.isNotEmpty;

  @override
  void initState() {
    super.initState();
    _subBreeds = _hasSubBreeds ? widget.breed.subBreeds : [widget.breed.name];
    _subBreedDogNames = _buildDogNamesForSubBreeds();
    _currentDogIndexes = List.filled(_subBreeds.length, 0);
    _imagePaths = _subBreeds.map(_imagePathForSubBreed).toList();
    _imageFutures = _imagePaths
        .map((path) => _api.fetchRandomImage(path))
        .toList();
    _updateFavoriteStatus();
  }

  void _updateFavoriteStatus() async {
    final currentKey = _currentFavoriteKey;
    final favorite = await _prefs.isFavorite(currentKey);
    if (mounted) {
      setState(() => _isFavorite = favorite);
    }
  }

  String get _currentFavoriteKey {
    final subBreed = _subBreeds[_currentSubBreedIndex];
    final dogName = _currentDogName(_currentSubBreedIndex);
    if (_hasSubBreeds) {
      return '$dogName ${subBreed.capitalize()} ${widget.breed.name.capitalize()}';
    }
    return '$dogName ${widget.breed.name.capitalize()}';
  }

  Future<void> _toggleFavorite() async {
    final currentKey = _currentFavoriteKey;
    if (_isFavorite) {
      await _prefs.removeFavorite(currentKey);
    } else {
      await _prefs.saveFavorite(currentKey);
    }

    if (mounted) {
      setState(() {
        _isFavorite = !_isFavorite;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            _isFavorite
                ? 'Added $currentKey to favorites'
                : 'Removed $currentKey from favorites',
          ),
        ),
      );
    }
  }

  List<List<String>> _buildDogNamesForSubBreeds() {
    final group = _groupForBreed(widget.breed.name);
    final names = List<String>.from(
      _dogNameOptions[group] ?? _dogNameOptions['default']!,
    );
    if (_hasSubBreeds) {
      return _subBreeds.map((_) => List<String>.from(names)).toList();
    }
    return [names];
  }

  String _currentDogName(int tabIndex) {
    return _subBreedDogNames[tabIndex][_currentDogIndexes[tabIndex]];
  }

  void _previousDog() {
    setState(() {
      final currentIndex = _currentDogIndexes[_currentSubBreedIndex];
      final count = _subBreedDogNames[_currentSubBreedIndex].length;
      _currentDogIndexes[_currentSubBreedIndex] =
          (currentIndex - 1 + count) % count;
    });
    _updateFavoriteStatus();
  }

  void _nextDog() {
    setState(() {
      final currentIndex = _currentDogIndexes[_currentSubBreedIndex];
      final count = _subBreedDogNames[_currentSubBreedIndex].length;
      _currentDogIndexes[_currentSubBreedIndex] = (currentIndex + 1) % count;
    });
    _updateFavoriteStatus();
  }

  Widget _buildDogActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    required bool enabled,
    bool active = false,
  }) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 4.0),
        child: MouseRegion(
          cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
          child: Material(
            color: active ? Colors.pink.withOpacity(0.14) : Colors.white,
            borderRadius: BorderRadius.circular(18),
            child: InkWell(
              borderRadius: BorderRadius.circular(18),
              onTap: enabled ? onTap : null,
              splashColor: Colors.pink.withOpacity(0.12),
              child: Container(
                height: 52,
                padding: const EdgeInsets.symmetric(horizontal: 12.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      icon,
                      size: 22,
                      color: enabled
                          ? (active
                                ? const Color(0xFF7C51C2)
                                : Colors.grey[800])
                          : Colors.grey[400],
                    ),
                    const SizedBox(width: 8),
                    Text(
                      label,
                      style: TextStyle(
                        color: enabled ? Colors.grey[800] : Colors.grey[400],
                        fontWeight: active ? FontWeight.bold : FontWeight.w600,
                        fontSize: 13,
                      ),
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

  _BreedProfile _profileForBreed(String breed) {
    final key = breed.toLowerCase();
    return _breedProfiles[key] ??
        const _BreedProfile(
          age: '2 years',
          lifespan: '10-14 years',
          breedPercentage: '90%',
          origin: 'Global',
          compatibility: 'Active families, first-time owners',
          characteristics: ['Gentle', 'Friendly', 'Intelligent'],
          color: Color(0xFF7C51C2),
          category: 'Mixed',
        );
  }

  String _groupForBreed(String breed) {
    const toyBreeds = ['affenpinscher', 'chihuahua', 'pomeranian', 'papillon'];
    const terrierBreeds = [
      'jack russell',
      'westie',
      'border terrier',
      'staffordshire bull terrier',
    ];
    const houndBreeds = ['beagle', 'dachshund', 'basset hound', 'greyhound'];
    const herdingBreeds = [
      'border collie',
      'australian shepherd',
      'german shepherd',
      'collie',
    ];
    const workingBreeds = ['rottweiler', 'doberman', 'boxer', 'husky'];
    const sportingBreeds = [
      'labrador',
      'golden retriever',
      'spaniel',
      'vizsla',
    ];

    if (toyBreeds.any((value) => breed.contains(value))) return 'toy';
    if (terrierBreeds.any((value) => breed.contains(value))) return 'terrier';
    if (houndBreeds.any((value) => breed.contains(value))) return 'hound';
    if (herdingBreeds.any((value) => breed.contains(value))) return 'herding';
    if (workingBreeds.any((value) => breed.contains(value))) return 'working';
    if (sportingBreeds.any((value) => breed.contains(value))) return 'sporting';
    return 'default';
  }

  final Map<String, List<String>> _dogNameOptions = {
    'toy': ['Milo', 'Pip', 'Teddy', 'Nibbles', 'Buttons'],
    'terrier': ['Scout', 'Rudy', 'Harley', 'Pepper', 'Finn'],
    'hound': ['Bailey', 'Jasper', 'Winnie', 'Ollie', 'Rosie'],
    'herding': ['Leader', 'Blaze', 'Nova', 'Sage', 'Luna'],
    'working': ['Tank', 'Shadow', 'Raven', 'Rex', 'Aurora'],
    'sporting': ['Duke', 'Maggie', 'Apollo', 'Ruby', 'Zoe'],
    'default': ['Buddy', 'Scout', 'Charlie', 'Milo', 'Luna'],
  };

  String _imagePathForSubBreed(String subBreed) {
    final breedName = widget.breed.name.toLowerCase();
    return _hasSubBreeds ? '$breedName/${subBreed.toLowerCase()}' : breedName;
  }

  Widget _buildSubBreedChips(Color accent) {
    if (!_hasSubBreeds) return const SizedBox.shrink();

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
      child: Row(
        children: _subBreeds.asMap().entries.map((entry) {
          final index = entry.key;
          final subBreed = entry.value;
          return Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: ChoiceChip(
              label: Text(subBreed.capitalize()),
              selected: _currentSubBreedIndex == index,
              selectedColor: accent.withOpacity(0.18),
              backgroundColor: Colors.white,
              labelStyle: TextStyle(
                color: _currentSubBreedIndex == index
                    ? accent
                    : Colors.grey[800],
                fontWeight: FontWeight.w600,
              ),
              side: BorderSide(color: accent.withOpacity(0.22)),
              onSelected: (_) {
                setState(() {
                  _currentSubBreedIndex = index;
                });
                _updateFavoriteStatus();
              },
            ),
          );
        }).toList(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final breedName = widget.breed.name.capitalize();
    final profile = _profileForBreed(widget.breed.name);
    final accent = profile.color;

    return Scaffold(
      appBar: AppBar(elevation: 0, title: Text(breedName)),
      body: Column(
        children: [
          _buildSubBreedChips(accent),
          Expanded(
            child: _buildDogCard(
              _subBreeds[_currentSubBreedIndex],
              _currentSubBreedIndex,
              accent,
            ),
          ),
        ],
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        child: Material(
          color: Colors.white.withOpacity(0.92),
          borderRadius: BorderRadius.circular(22),
          elevation: 4,
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 10.0,
              vertical: 8.0,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildDogActionButton(
                  icon: Icons.arrow_back_ios_new,
                  label: 'Previous',
                  onTap: _previousDog,
                  enabled: _subBreedDogNames[_currentSubBreedIndex].length > 1,
                ),
                _buildDogActionButton(
                  icon: Icons.favorite,
                  label: 'Favorite',
                  onTap: _toggleFavorite,
                  enabled: true,
                  active: _isFavorite,
                ),
                _buildDogActionButton(
                  icon: Icons.arrow_forward_ios,
                  label: 'Next',
                  onTap: _nextDog,
                  enabled: _subBreedDogNames[_currentSubBreedIndex].length > 1,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDogCard(String subBreed, int tabIndex, Color accent) {
    final currentIndex = _currentDogIndexes[tabIndex];
    final dogName = _currentDogName(tabIndex);
    final imageFuture = _imageFutures[tabIndex];
    final isBreedOnly = !_hasSubBreeds;
    final dogLabel = isBreedOnly
        ? '$dogName ${widget.breed.name.capitalize()}'
        : '$dogName ${subBreed.capitalize()} ${widget.breed.name.capitalize()}';
    final profile = _profileForBreed(widget.breed.name);
    final dogSetCount = _subBreedDogNames[tabIndex].length;
    final dogContext = isBreedOnly
        ? widget.breed.name.capitalize()
        : '${subBreed.capitalize()} ${widget.breed.name.capitalize()}';
    return FutureBuilder<String>(
      future: imageFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return Center(
            child: CircularProgressIndicator(
              color: Theme.of(context).primaryColor,
            ),
          );
        }

        if (snapshot.hasError) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Text(
                'Unable to load the dog photo right now. Please try again later.',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Colors.red[700],
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          );
        }

        final imageUrl = snapshot.data!;
        return SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(
              vertical: 18.0,
              horizontal: 16.0,
            ),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 900),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(32),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.08),
                            blurRadius: 28,
                            offset: const Offset(0, 16),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: LinearGradient(
                                colors: [
                                  accent.withOpacity(0.9),
                                  accent.withOpacity(0.35),
                                ],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                            ),
                            child: Container(
                              width: 200,
                              height: 200,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white,
                              ),
                              child: ClipOval(
                                child: Image.network(
                                  imageUrl,
                                  fit: BoxFit.cover,
                                  loadingBuilder:
                                      (context, child, loadingProgress) {
                                        if (loadingProgress == null) {
                                          return child;
                                        }
                                        return const Center(
                                          child: CircularProgressIndicator(),
                                        );
                                      },
                                  errorBuilder: (context, error, stackTrace) =>
                                      const Center(child: Icon(Icons.error)),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 18),
                          Text(
                            dogLabel,
                            style: const TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'Dog ${currentIndex + 1} of $dogSetCount in $dogContext',
                            style: Theme.of(context).textTheme.bodySmall
                                ?.copyWith(color: Colors.grey[600]),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'This ${profile.category.toLowerCase()} breed offers ${profile.characteristics.join(', ').toLowerCase()} energy and a warm, loyal personality.',
                            textAlign: TextAlign.center,
                            style: Theme.of(context).textTheme.bodyMedium
                                ?.copyWith(
                                  color: Colors.grey[700],
                                  height: 1.5,
                                ),
                          ),
                          const SizedBox(height: 18),
                          Wrap(
                            alignment: WrapAlignment.center,
                            spacing: 10,
                            runSpacing: 10,
                            children: [
                              _buildInfoChip('Age', profile.age, accent),
                              _buildInfoChip(
                                'Lifespan',
                                profile.lifespan,
                                accent,
                              ),
                              _buildInfoChip('Origin', profile.origin, accent),
                              _buildInfoChip(
                                'Compatibility',
                                profile.compatibility,
                                accent,
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Wrap(
                            alignment: WrapAlignment.center,
                            spacing: 10,
                            runSpacing: 10,
                            children: profile.characteristics
                                .map(
                                  (trait) => Chip(
                                    label: Text(trait),
                                    backgroundColor: Colors.white,
                                    side: BorderSide(
                                      color: accent.withOpacity(0.16),
                                    ),
                                    labelStyle: TextStyle(
                                      color: accent,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                )
                                .toList(),
                          ),
                          const SizedBox(height: 18),
                          Text(
                            'A loyal companion with a strong sense of curiosity and kindness. ${dogName.capitalize()} is ready to find a home where they can thrive and be cherished.',
                            textAlign: TextAlign.center,
                            style: Theme.of(context).textTheme.bodyMedium
                                ?.copyWith(
                                  color: Colors.grey[700],
                                  height: 1.5,
                                ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildInfoChip(String label, String value, Color accent) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: accent.withOpacity(0.12),
        borderRadius: BorderRadius.circular(16),
      ),
      child: RichText(
        text: TextSpan(
          style: TextStyle(color: Colors.grey[800], fontSize: 13),
          children: [
            TextSpan(
              text: '$label: ',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            TextSpan(text: value),
          ],
        ),
      ),
    );
  }
}

class _BreedProfile {
  final String age;
  final String lifespan;
  final String breedPercentage;
  final String origin;
  final String compatibility;
  final List<String> characteristics;
  final Color color;
  final String category;

  const _BreedProfile({
    required this.age,
    required this.lifespan,
    required this.breedPercentage,
    required this.origin,
    required this.compatibility,
    required this.characteristics,
    required this.color,
    required this.category,
  });
}

const Map<String, _BreedProfile> _breedProfiles = {
  'affenpinscher': _BreedProfile(
    age: '3 years',
    lifespan: '11-15 years',
    breedPercentage: '95%',
    origin: 'Germany',
    compatibility: 'Families, Active Owners',
    characteristics: ['Alert', 'Loyal', 'Curious'],
    color: Color(0xFF2E7D32),
    category: 'Toy',
  ),
  'labrador': _BreedProfile(
    age: '4 years',
    lifespan: '10-12 years',
    breedPercentage: '100%',
    origin: 'Canada',
    compatibility: 'Families, Outdoor Lovers',
    characteristics: ['Friendly', 'Energetic', 'Intelligent'],
    color: Color(0xFF1E88E5),
    category: 'Sporting',
  ),
  'german shepherd': _BreedProfile(
    age: '5 years',
    lifespan: '9-13 years',
    breedPercentage: '90%',
    origin: 'Germany',
    compatibility: 'Experienced Owners, Active Homes',
    characteristics: ['Protective', 'Bold', 'Smart'],
    color: Color(0xFF8E24AA),
    category: 'Herding',
  ),
  'beagle': _BreedProfile(
    age: '3 years',
    lifespan: '12-15 years',
    breedPercentage: '85%',
    origin: 'United Kingdom',
    compatibility: 'Families, Curious Minds',
    characteristics: ['Curious', 'Happy', 'Friendly'],
    color: Color(0xFFF4511E),
    category: 'Hound',
  ),
};

extension StringCapitalization on String {
  String capitalize() {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1)}';
  }
}
