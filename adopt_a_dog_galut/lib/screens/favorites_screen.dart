import 'package:adopt_a_dog/design/design_system.dart';
import 'package:adopt_a_dog/models/breed.dart';
import 'package:adopt_a_dog/screens/breed_detail_screen.dart';
import 'package:adopt_a_dog/services/dog_api_service.dart';
import 'package:adopt_a_dog/services/likes_service.dart';
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

  int _likesForBreed(String breedName) {
    return LikesService.likesForBreed(breedName);
  }

  List<MapEntry<String, int>> get _topLikedBreeds {
    final breedNames = {
      ..._breedFavorites,
      ..._photoFavorites.map((photo) => photo.breed),
    };
    final ranked = breedNames
        .map((breed) => MapEntry(breed, _likesForBreed(breed)))
        .toList();
    ranked.sort((a, b) => b.value.compareTo(a.value));
    return ranked;
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
      _photoFavorites = _photoFavorites
          .where((p) => p.imageUrl != imageUrl)
          .toList();
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
    final sortedPhotos = [..._photoFavorites]
      ..sort(
        (a, b) => _likesForBreed(b.breed).compareTo(_likesForBreed(a.breed)),
      );
    final topLikedBreeds = _topLikedBreeds;
    final galleryWidth = DesignSystem.getResponsiveGalleryWidth(
      MediaQuery.of(context).size.width,
    );

    return Scaffold(
      appBar: AppBar(
        titleSpacing: DesignSystem.space20,
        toolbarHeight: 68,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        backgroundColor: Colors.transparent,
        title: const Text('Favorites', style: DesignSystem.titleXL),
      ),
      body: Stack(
        children: [
          Container(
            decoration: const BoxDecoration(gradient: DesignSystem.bgGradient),
          ),
          const PawPatternLayer(),
          _loading
              ? const Center(child: CircularProgressIndicator())
              : isEmpty
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(DesignSystem.space32),
                    child: Container(
                      padding: const EdgeInsets.all(DesignSystem.space24),
                      decoration: DesignSystem.cardDecoration,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.inventory_2_outlined,
                            color: DesignSystem.darkBrown,
                            size: 36,
                          ),
                          const SizedBox(height: DesignSystem.space12),
                          Text(
                            'No saved items yet. Bookmark breeds and photos from each profile.',
                            textAlign: TextAlign.center,
                            style: DesignSystem.bodyLg.copyWith(
                              color: DesignSystem.textSecondary,
                            ),
                          ),
                        ],
                      ),
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
                          Padding(
                            padding: const EdgeInsets.fromLTRB(
                              DesignSystem.space16,
                              DesignSystem.space4,
                              DesignSystem.space16,
                              DesignSystem.space8,
                            ),
                            child: Container(
                              padding: const EdgeInsets.all(
                                DesignSystem.space16,
                              ),
                              decoration: DesignSystem.cardDecoration,
                              child: Row(
                                children: [
                                  Expanded(
                                    child: _FavoriteStat(
                                      label: 'Breeds',
                                      value: _breedFavorites.length.toString(),
                                      color: DesignSystem.primaryBrown,
                                    ),
                                  ),
                                  const SizedBox(width: DesignSystem.space12),
                                  Expanded(
                                    child: _FavoriteStat(
                                      label: 'Photos',
                                      value: _photoFavorites.length.toString(),
                                      color: DesignSystem.accentOrange,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          if (topLikedBreeds.isNotEmpty)
                            Padding(
                              padding: const EdgeInsets.fromLTRB(20, 14, 20, 8),
                              child: Text(
                                'Top liked dogs',
                                style: DesignSystem.labelLg.copyWith(
                                  color: DesignSystem.textSecondary,
                                ),
                              ),
                            ),
                          if (topLikedBreeds.isNotEmpty)
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: DesignSystem.space16,
                              ),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  vertical: DesignSystem.space4,
                                ),
                                decoration: DesignSystem.cardDecoration,
                                child: Column(
                                  children: topLikedBreeds
                                      .take(5)
                                      .toList()
                                      .asMap()
                                      .entries
                                      .map((entry) {
                                        final index = entry.key;
                                        final item = entry.value;
                                        return ListTile(
                                          dense: true,
                                          leading: CircleAvatar(
                                            radius: 14,
                                            backgroundColor: DesignSystem
                                                .accentOrange
                                                .withAlpha(28),
                                            child: Text(
                                              '${index + 1}',
                                              style: const TextStyle(
                                                color: DesignSystem.textPrimary,
                                                fontSize: 12,
                                                fontWeight: FontWeight.w700,
                                              ),
                                            ),
                                          ),
                                          title: Text(
                                            _capitalize(item.key),
                                            style: DesignSystem.titleSm,
                                          ),
                                          trailing: SizedBox(
                                            width: 120,
                                            child: Text(
                                              '${LikesService.formatLikes(item.value)} likes',
                                              textAlign: TextAlign.right,
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              style: DesignSystem.bodyMd
                                                  .copyWith(
                                                    fontWeight: FontWeight.w600,
                                                    color: DesignSystem
                                                        .textSecondary,
                                                  ),
                                            ),
                                          ),
                                        );
                                      })
                                      .toList(),
                                ),
                              ),
                            ),
                          if (_breedFavorites.isNotEmpty)
                            Padding(
                              padding: const EdgeInsets.fromLTRB(20, 16, 20, 6),
                              child: Text(
                                'Saved breeds',
                                style: DesignSystem.labelLg.copyWith(
                                  color: DesignSystem.textSecondary,
                                ),
                              ),
                            ),
                          ..._breedFavorites.map(
                            (breed) => Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 5,
                              ),
                              child: Card(
                                elevation: 0,
                                shape: RoundedRectangleBorder(
                                  borderRadius: DesignSystem.borderSmall,
                                  side: const BorderSide(
                                    color: DesignSystem.surfaceBorder,
                                    width: 1,
                                  ),
                                ),
                                child: ListTile(
                                  onTap: () => _openBreed(breed),
                                  leading: ClipRRect(
                                    borderRadius: DesignSystem.borderMedium,
                                    child: SizedBox(
                                      width: 60,
                                      height: 60,
                                      child: _breedThumbs[breed] == null
                                          ? const ColoredBox(
                                              color:
                                                  DesignSystem.imagePlaceholder,
                                              child: Icon(
                                                Icons.pets,
                                                color:
                                                    DesignSystem.imageErrorIcon,
                                              ),
                                            )
                                          : DogNetworkImage(
                                              url: _breedThumbs[breed]!,
                                            ),
                                    ),
                                  ),
                                  title: Text(
                                    _capitalize(breed),
                                    style: DesignSystem.titleSm.copyWith(
                                      fontSize: 18,
                                    ),
                                  ),
                                  subtitle: const Text(
                                    'Open breed file',
                                    style: DesignSystem.bodyMd,
                                  ),
                                  trailing: IconButton(
                                    icon: const Icon(
                                      Icons.delete_outline,
                                      color: DesignSystem.darkBrown,
                                    ),
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
                              child: Text(
                                'Saved photos (highest likes first)',
                                style: DesignSystem.labelLg.copyWith(
                                  color: DesignSystem.textSecondary,
                                ),
                              ),
                            ),
                          if (_photoFavorites.isNotEmpty)
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: DesignSystem.space16,
                              ),
                              child: Wrap(
                                spacing: DesignSystem.space12,
                                runSpacing: DesignSystem.space12,
                                children: sortedPhotos.map((photo) {
                                  final likes = _likesForBreed(photo.breed);
                                  return SizedBox(
                                    width: galleryWidth,
                                    child: ClipRRect(
                                      borderRadius: DesignSystem.borderMedium,
                                      child: Stack(
                                        children: [
                                          SizedBox(
                                            height: 164,
                                            width: double.infinity,
                                            child: DogNetworkImage(
                                              url: photo.imageUrl,
                                            ),
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
                                                    DesignSystem.darkBrown
                                                        .withAlpha(180),
                                                  ],
                                                ),
                                              ),
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                    horizontal:
                                                        DesignSystem.space12,
                                                    vertical:
                                                        DesignSystem.space8,
                                                  ),
                                              child: Text(
                                                _capitalize(photo.breed),
                                                style: const TextStyle(
                                                  color: Colors.white,
                                                  fontWeight: FontWeight.w600,
                                                  fontSize: 12,
                                                ),
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ),
                                          ),
                                          Positioned(
                                            left: DesignSystem.space8,
                                            top: DesignSystem.space8,
                                            child: Container(
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                    horizontal:
                                                        DesignSystem.space8,
                                                    vertical:
                                                        DesignSystem.space4,
                                                  ),
                                              decoration: BoxDecoration(
                                                color: Colors.black.withAlpha(
                                                  125,
                                                ),
                                                borderRadius:
                                                    DesignSystem.borderSmall,
                                              ),
                                              child: Row(
                                                mainAxisSize: MainAxisSize.min,
                                                children: [
                                                  const Icon(
                                                    Icons.favorite,
                                                    color: Colors.white,
                                                    size: 12,
                                                  ),
                                                  const SizedBox(
                                                    width: DesignSystem.space4,
                                                  ),
                                                  Text(
                                                    LikesService.formatLikes(
                                                      likes,
                                                    ),
                                                    style: const TextStyle(
                                                      color: Colors.white,
                                                      fontSize: 11,
                                                      fontWeight:
                                                          FontWeight.w600,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                          Positioned.fill(
                                            child: IgnorePointer(
                                              child: Container(
                                                decoration: BoxDecoration(
                                                  border: Border.all(
                                                    color: Colors.white
                                                        .withAlpha(110),
                                                    width: 1,
                                                  ),
                                                  borderRadius:
                                                      DesignSystem.borderMedium,
                                                ),
                                              ),
                                            ),
                                          ),
                                          Positioned(
                                            right: DesignSystem.space8,
                                            top: DesignSystem.space8,
                                            child: CircleAvatar(
                                              radius: 16,
                                              backgroundColor: DesignSystem
                                                  .darkBrown
                                                  .withAlpha(145),
                                              child: IconButton(
                                                padding: EdgeInsets.zero,
                                                iconSize: 16,
                                                onPressed: () => _removePhoto(
                                                  photo.imageUrl,
                                                ),
                                                icon: const Icon(
                                                  Icons.delete_outline,
                                                  color: Colors.white,
                                                ),
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
        label: const Text('Clear Favorites'),
        icon: const Icon(Icons.delete_outline),
      ),
    );
  }
}

class _FavoriteStat extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _FavoriteStat({
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: DesignSystem.space12,
        vertical: DesignSystem.space12,
      ),
      decoration: BoxDecoration(
        color: color.withAlpha(16),
        borderRadius: DesignSystem.borderSmall,
        border: Border.all(color: color, width: 1.4),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: DesignSystem.labelLg.copyWith(color: color)),
          const SizedBox(height: DesignSystem.space4),
          Text(
            value,
            style: DesignSystem.titleLg.copyWith(
              color: color,
              fontSize: 28,
              letterSpacing: 0.4,
            ),
          ),
        ],
      ),
    );
  }
}
