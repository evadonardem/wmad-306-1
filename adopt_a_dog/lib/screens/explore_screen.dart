import 'package:adopt_a_dog/design/design_system.dart';
import 'package:adopt_a_dog/screens/favorites_screen.dart';
import 'package:adopt_a_dog/services/dog_api_service.dart';
import 'package:adopt_a_dog/services/likes_service.dart';
import 'package:adopt_a_dog/services/prefs_service.dart';
import 'package:adopt_a_dog/widgets/dog_network_image.dart';
import 'package:adopt_a_dog/widgets/paw_pattern_layer.dart';
import 'package:flutter/material.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final DogApiService _dogApi = DogApiService();
  final PrefsService _prefs = PrefsService();

  bool _isLoading = true;
  bool _isFavorite = false;
  String? _breed;
  String? _imageUrl;
  int? _likeCount;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadNextPhoto();
  }

  String _capitalize(String value) {
    if (value.isEmpty) return value;
    return value[0].toUpperCase() + value.substring(1);
  }

  Future<void> _loadNextPhoto() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final random = await _dogApi.fetchRandomBreedAndImage();
      final breed = random['breed'];
      final imageUrl = random['imageUrl'];

      if (breed == null || imageUrl == null) {
        throw Exception('Missing random dog payload');
      }

      final alreadyFavorite = await _prefs.isPhotoFavorite(imageUrl);

      if (!mounted) return;
      setState(() {
        _breed = breed;
        _imageUrl = imageUrl;
        _likeCount = LikesService.likesForBreed(breed);
        _isFavorite = alreadyFavorite;
        _isLoading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _isLoading = false;
        _error = 'Could not load a random dog right now. Try again.';
        _likeCount = null;
      });
    }
  }

  Future<void> _addCurrentPhotoToFavorites() async {
    final breed = _breed;
    final imageUrl = _imageUrl;
    if (breed == null || imageUrl == null || _isFavorite) {
      return;
    }

    try {
      await _prefs.savePhotoFavorite(breed, imageUrl);
      if (!mounted) return;
      setState(() {
        _isFavorite = true;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${_capitalize(breed)} photo added to favorites.'),
        ),
      );
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Could not save favorite.')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final breed = _breed;
    final imageUrl = _imageUrl;

    return Scaffold(
      appBar: AppBar(
        titleSpacing: DesignSystem.space20,
        toolbarHeight: 68,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        backgroundColor: Colors.transparent,
        title: const Text('Explore', style: DesignSystem.titleXL),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const FavoritesScreen()),
              );
            },
            icon: const Icon(Icons.favorite_border),
            color: DesignSystem.textPrimary,
          ),
          const SizedBox(width: DesignSystem.space8),
        ],
      ),
      body: Stack(
        children: [
          Container(
            decoration: const BoxDecoration(gradient: DesignSystem.bgGradient),
          ),
          const PawPatternLayer(),
          Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 900),
              child: ListView(
                padding: const EdgeInsets.fromLTRB(
                  DesignSystem.space16,
                  DesignSystem.space16,
                  DesignSystem.space16,
                  DesignSystem.space40,
                ),
                children: [
                  Text(
                    'Find random dogs and save the ones you love.',
                    style: DesignSystem.bodyMd.copyWith(
                      color: DesignSystem.textSecondary,
                    ),
                  ),
                  const SizedBox(height: DesignSystem.space12),
                  Container(
                    decoration: BoxDecoration(
                      borderRadius: DesignSystem.borderXL,
                      boxShadow: DesignSystem.shadowXL,
                    ),
                    child: ClipRRect(
                      borderRadius: DesignSystem.borderXL,
                      child: SizedBox(
                        height: 430,
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            if (imageUrl == null)
                              Container(
                                color: DesignSystem.imagePlaceholder,
                                alignment: Alignment.center,
                                child: const Icon(
                                  Icons.pets,
                                  size: 52,
                                  color: DesignSystem.imageErrorIcon,
                                ),
                              )
                            else
                              AnimatedSwitcher(
                                duration: DesignSystem.durationNormal,
                                switchInCurve: Curves.easeOutCubic,
                                switchOutCurve: Curves.easeInCubic,
                                child: DogNetworkImage(
                                  key: ValueKey(imageUrl),
                                  url: imageUrl,
                                ),
                              ),
                            Positioned.fill(
                              child: DecoratedBox(
                                decoration: const BoxDecoration(
                                  gradient: DesignSystem.heroOverlay,
                                ),
                              ),
                            ),
                            if (breed != null)
                              Positioned(
                                left: DesignSystem.space16,
                                right: DesignSystem.space16,
                                bottom: DesignSystem.space16,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: DesignSystem.space12,
                                        vertical: DesignSystem.space6,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.white.withAlpha(220),
                                        borderRadius: DesignSystem.borderSmall,
                                      ),
                                      child: const Text(
                                        'Random pick',
                                        style: TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w600,
                                          color: DesignSystem.darkBrown,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: DesignSystem.space8),
                                    Text(
                                      _capitalize(breed),
                                      style: DesignSystem.displayLarge,
                                    ),
                                    if (_likeCount != null) ...[
                                      const SizedBox(
                                        height: DesignSystem.space6,
                                      ),
                                      Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          const Icon(
                                            Icons.favorite,
                                            size: 14,
                                            color: Colors.white,
                                          ),
                                          const SizedBox(
                                            width: DesignSystem.space4,
                                          ),
                                          Text(
                                            '${LikesService.formatLikes(_likeCount!)} likes',
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 12,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                            if (_isLoading)
                              Container(
                                color: Colors.black.withAlpha(55),
                                alignment: Alignment.center,
                                child: const CircularProgressIndicator(),
                              ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: DesignSystem.space16),
                  if (_error != null)
                    Padding(
                      padding: const EdgeInsets.only(
                        bottom: DesignSystem.space8,
                      ),
                      child: Text(
                        _error!,
                        style: DesignSystem.bodyMd.copyWith(
                          color: Colors.red.shade800,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  Row(
                    children: [
                      Expanded(
                        child: FilledButton.icon(
                          onPressed: _isLoading || imageUrl == null
                              ? null
                              : _addCurrentPhotoToFavorites,
                          icon: Icon(
                            _isFavorite
                                ? Icons.favorite
                                : Icons.favorite_border,
                          ),
                          label: Text(
                            _isFavorite
                                ? 'Added to Favorites'
                                : 'Add to Favorite',
                          ),
                        ),
                      ),
                      const SizedBox(width: DesignSystem.space12),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _isLoading ? null : _loadNextPhoto,
                          icon: const Icon(Icons.navigate_next),
                          label: const Text('Next Photo'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
