import 'package:adopt_a_dog/design/design_system.dart';
import 'package:adopt_a_dog/models/breed.dart';
import 'package:adopt_a_dog/screens/breed_detail_screen.dart';
import 'package:adopt_a_dog/services/dog_api_service.dart';
import 'package:adopt_a_dog/services/prefs_service.dart';
import 'package:adopt_a_dog/widgets/dog_network_image.dart';
import 'package:adopt_a_dog/widgets/paw_pattern_layer.dart';
import 'package:flutter/material.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final DogApiService _dogApi = DogApiService();
  final PrefsService _prefs = PrefsService();

  bool _loading = true;
  List<String> _breedFavorites = const [];
  List<PhotoFavorite> _photoFavorites = const [];
  Map<String, String?> _breedThumbs = const {};

  String _capitalize(String value) {
    if (value.isEmpty) return value;
    return value[0].toUpperCase() + value.substring(1);
  }

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() {
      _loading = true;
    });

    final breedFavorites = await _prefs.loadFavorites();
    final photoFavorites = await _prefs.loadPhotoFavorites();

    final thumbs = <String, String?>{};
    for (final breed in breedFavorites) {
      try {
        thumbs[breed] = await _dogApi.fetchRandomImage(breed);
      } catch (_) {
        thumbs[breed] = null;
      }
    }

    if (!mounted) return;
    setState(() {
      _breedFavorites = breedFavorites;
      _photoFavorites = photoFavorites;
      _breedThumbs = thumbs;
      _loading = false;
    });
  }

  Future<void> _removeBreed(String breed) async {
    await _prefs.removeFavorite(breed);
    if (!mounted) return;
    setState(() {
      _breedFavorites = _breedFavorites.where((b) => b != breed).toList();
      _breedThumbs = {..._breedThumbs}..remove(breed);
    });
  }

  Future<void> _removePhoto(String imageUrl) async {
    await _prefs.removePhotoFavorite(imageUrl);
    if (!mounted) return;
    setState(() {
      _photoFavorites = _photoFavorites.where((p) => p.imageUrl != imageUrl).toList();
    });
  }

  Future<void> _clearBreedFavorites() async {
    await _prefs.clearFavorites();
    if (!mounted) return;
    setState(() {
      _breedFavorites = const [];
      _breedThumbs = const {};
    });
  }

  void _openBreed(String breed) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => BreedDetailScreen(
          breed: Breed(name: breed, subBreeds: const []),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isEmpty = _breedFavorites.isEmpty && _photoFavorites.isEmpty;

    return Scaffold(
      appBar: AppBar(
        titleSpacing: DesignSystem.space20,
        toolbarHeight: 68,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        backgroundColor: DesignSystem.bgCream,
        title: const Text('Favorites', style: DesignSystem.titleXL),
      ),
      body: Stack(
        children: [
          Container(decoration: const BoxDecoration(gradient: DesignSystem.bgGradient)),
          const PawPatternLayer(),
          _loading
              ? const Center(child: CircularProgressIndicator())
              : isEmpty
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(DesignSystem.space32),
                    child: Text(
                      'No favorites yet. Save breeds or photos from the detail screen.',
                      textAlign: TextAlign.center,
                      style: DesignSystem.bodyLg,
                    ),
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadData,
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 1200),
                      child: ListView(
                    padding: const EdgeInsets.only(bottom: 100),
                    children: [
                      if (_breedFavorites.isNotEmpty)
                        const Padding(
                          padding: EdgeInsets.fromLTRB(20, 16, 20, 6),
                          child: Text(
                            'SAVED BREEDS',
                            style: TextStyle(
                              fontWeight: FontWeight.w700,
                              letterSpacing: 1.2,
                              fontSize: 11,
                              color: Color(0xFF745845),
                            ),
                          ),
                        ),
                      ..._breedFavorites.map(
                        (breed) => Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 5),
                          child: Card(
                            child: ListTile(
                              onTap: () => _openBreed(breed),
                              leading: ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: SizedBox(
                                  width: 56,
                                  height: 56,
                                  child: _breedThumbs[breed] == null
                                      ? const ColoredBox(
                                          color: Color(0xFFE8D5BA),
                                          child: Icon(Icons.pets, color: Color(0xFF6D4C41)),
                                        )
                                      : DogNetworkImage(url: _breedThumbs[breed]!),
                                ),
                              ),
                              title: Text(_capitalize(breed)),
                              subtitle: const Text('Tap to explore'),
                              trailing: IconButton(
                                icon: const Icon(Icons.delete_outline),
                                onPressed: () => _removeBreed(breed),
                              ),
                            ),
                          ),
                        ),
                      ),
                      if (_photoFavorites.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.fromLTRB(
                            DesignSystem.space20,
                            DesignSystem.space20,
                            DesignSystem.space20,
                            DesignSystem.space12,
                          ),
                          child: const Text('SAVED PHOTOS', style: DesignSystem.labelLg),
                        ),
                      if (_photoFavorites.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: DesignSystem.space16),
                          child: Wrap(
                            spacing: DesignSystem.space12,
                            runSpacing: DesignSystem.space12,
                            children: _photoFavorites.map((photo) {
                              return SizedBox(
                                width: (MediaQuery.of(context).size.width - 56) / 2,
                                child: ClipRRect(
                                  borderRadius: DesignSystem.borderMedium,
                                  child: Stack(
                                    children: [
                                      SizedBox(
                                        height: 164,
                                        width: double.infinity,
                                        child: DogNetworkImage(url: photo.imageUrl),
                                      ),
                                      Positioned(
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        child: Container(
                                          decoration: BoxDecoration(
                                            gradient: LinearGradient(
                                              begin: Alignment.topCenter,
                                              end: Alignment.bottomCenter,
                                              colors: [
                                                Colors.black.withAlpha(0),
                                                Colors.black.withAlpha(140),
                                              ],
                                            ),
                                          ),
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: DesignSystem.space12,
                                            vertical: DesignSystem.space8,
                                          ),
                                          child: Text(
                                            _capitalize(photo.breed),
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontWeight: FontWeight.w700,
                                              fontSize: 13,
                                            ),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                      ),
                                      Positioned(
                                        right: DesignSystem.space8,
                                        top: DesignSystem.space8,
                                        child: CircleAvatar(
                                          radius: 16,
                                          backgroundColor: Colors.black.withAlpha(110),
                                          child: IconButton(
                                            padding: EdgeInsets.zero,
                                            iconSize: 16,
                                            onPressed: () => _removePhoto(photo.imageUrl),
                                            icon: const Icon(Icons.favorite, color: Colors.white),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                    ],
                  ),
                    ),
                  ),
                ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _breedFavorites.isEmpty ? null : _clearBreedFavorites,
        backgroundColor: DesignSystem.primaryBrown,
        foregroundColor: Colors.white,
        label: const Text('Clear Breeds'),
        icon: const Icon(Icons.delete_outline),
      ),
    );
  }
}
