import 'package:adopt_a_dog/design/design_system.dart';
import 'package:adopt_a_dog/models/breed.dart';
import 'package:adopt_a_dog/services/dog_api_service.dart';
import 'package:adopt_a_dog/services/likes_service.dart';
import 'package:adopt_a_dog/services/prefs_service.dart';
import 'package:adopt_a_dog/widgets/paw_pattern_layer.dart';
import 'package:flutter/material.dart';

class BreedDetailScreen extends StatefulWidget {
  final Breed breed;

  const BreedDetailScreen({super.key, required this.breed});

  @override
  State<BreedDetailScreen> createState() => _BreedDetailScreenState();
}

class _BreedDetailScreenState extends State<BreedDetailScreen> {
  final DogApiService _dogApi = DogApiService();
  final PrefsService _prefs = PrefsService();

  String? _selectedSubBreed;
  String? _mainImageUrl;
  List<String> _galleryUrls = const [];
  Set<String> _photoFavorites = <String>{};
  bool _isBreedFavorite = false;
  bool _loading = true;
  bool _galleryLoading = false;
  String? _error;

  String _capitalize(String value) {
    if (value.isEmpty) return value;
    return value[0].toUpperCase() + value.substring(1);
  }

  String get _currentPath {
    if (_selectedSubBreed == null) return widget.breed.name;
    return '${widget.breed.name}/$_selectedSubBreed';
  }

  @override
  void initState() {
    super.initState();
    _initialize();
  }

  Future<void> _initialize() async {
    await Future.wait([_loadFavoriteState(), _loadImages(_currentPath)]);
  }

  Future<void> _loadFavoriteState() async {
    final breedFavorites = await _prefs.loadFavorites();
    final photoFavorites = await _prefs.loadPhotoFavorites();

    if (!mounted) return;
    setState(() {
      _isBreedFavorite = breedFavorites.contains(widget.breed.name);
      _photoFavorites = photoFavorites.map((p) => p.imageUrl).toSet();
    });
  }

  Future<void> _loadImages(String breedPath) async {
    setState(() {
      _loading = true;
      _error = null;
      _galleryUrls = const [];
    });

    try {
      final main = await _dogApi.fetchRandomImage(breedPath);
      if (!mounted) return;
      setState(() {
        _mainImageUrl = main;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _error = 'Failed to load dog image.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }

    setState(() {
      _galleryLoading = true;
    });

    try {
      final gallery = await _dogApi.fetchMultipleImages(breedPath, count: 4);
      if (!mounted) return;
      setState(() {
        _galleryUrls = gallery;
      });
    } catch (_) {
      // Keep UI usable when gallery fetch fails.
    } finally {
      if (mounted) {
        setState(() {
          _galleryLoading = false;
        });
      }
    }
  }

  Future<void> _toggleBreedFavorite() async {
    if (_isBreedFavorite) {
      await _prefs.removeFavorite(widget.breed.name);
    } else {
      await _prefs.saveFavorite(widget.breed.name);
    }

    if (!mounted) return;
    setState(() {
      _isBreedFavorite = !_isBreedFavorite;
    });

    final message = _isBreedFavorite
        ? '${_capitalize(widget.breed.name)} added to favorites.'
        : '${_capitalize(widget.breed.name)} removed from favorites.';

    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message)));
  }

  Future<void> _togglePhotoFavorite(String imageUrl) async {
    if (_photoFavorites.contains(imageUrl)) {
      await _prefs.removePhotoFavorite(imageUrl);
      if (!mounted) return;
      setState(() {
        _photoFavorites = {..._photoFavorites}..remove(imageUrl);
      });
      return;
    }

    await _prefs.savePhotoFavorite(widget.breed.name, imageUrl);
    if (!mounted) return;
    setState(() {
      _photoFavorites = {..._photoFavorites, imageUrl};
    });
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final breedLikes = LikesService.likesForBreed(widget.breed.name);
    final mainLikes = _mainImageUrl == null ? null : breedLikes;

    return Scaffold(
      appBar: AppBar(
        titleSpacing: DesignSystem.space20,
        toolbarHeight: 68,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        backgroundColor: Colors.transparent,
        title: Text(
          _capitalize(widget.breed.name),
          style: DesignSystem.titleXL,
        ),
        actions: [
          IconButton(
            onPressed: _toggleBreedFavorite,
            icon: Icon(
              _isBreedFavorite ? Icons.pets : Icons.pets_outlined,
              color: _isBreedFavorite
                  ? DesignSystem.accentOrange
                  : DesignSystem.textSecondary,
              size: 26,
            ),
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
          _loading
              ? const Center(child: CircularProgressIndicator())
              : _error != null
              ? Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(_error!),
                      const SizedBox(height: DesignSystem.space16),
                      FilledButton(
                        style: DesignSystem.filledButtonStyle,
                        onPressed: () => _loadImages(_currentPath),
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 1200),
                    child: ListView(
                      padding: const EdgeInsets.only(
                        bottom: DesignSystem.space32,
                      ),
                      children: [
                        Padding(
                          padding: const EdgeInsets.fromLTRB(
                            DesignSystem.space16,
                            DesignSystem.space6,
                            DesignSystem.space16,
                            0,
                          ),
                          child: ClipRRect(
                            borderRadius: DesignSystem.borderXL,
                            child: Stack(
                              children: [
                                Container(
                                  decoration: BoxDecoration(
                                    borderRadius: DesignSystem.borderXL,
                                    border: Border.all(
                                      color: Colors.white.withAlpha(140),
                                      width: 1,
                                    ),
                                    boxShadow: DesignSystem.shadowXL,
                                  ),
                                  child: SizedBox(
                                    height: DesignSystem.getMainImageHeight(
                                      screenSize.width,
                                      screenSize.height,
                                    ),
                                    width: double.infinity,
                                    child: _mainImageUrl == null
                                        ? const ColoredBox(
                                            color:
                                                DesignSystem.imagePlaceholder,
                                          )
                                        : Image.network(
                                            _mainImageUrl!,
                                            fit: BoxFit.contain,
                                            errorBuilder:
                                                (context, error, stackTrace) {
                                                  return const ColoredBox(
                                                    color: DesignSystem
                                                        .imagePlaceholder,
                                                    child: Center(
                                                      child: Icon(
                                                        Icons.broken_image,
                                                        color: DesignSystem
                                                            .imageErrorIcon,
                                                      ),
                                                    ),
                                                  );
                                                },
                                            loadingBuilder:
                                                (context, child, progress) {
                                                  if (progress == null) {
                                                    return child;
                                                  }
                                                  return const ColoredBox(
                                                    color: DesignSystem
                                                        .imagePlaceholder,
                                                    child: Center(
                                                      child: CircularProgressIndicator(
                                                        strokeWidth: 2,
                                                        valueColor:
                                                            AlwaysStoppedAnimation(
                                                              DesignSystem
                                                                  .primaryBrown,
                                                            ),
                                                      ),
                                                    ),
                                                  );
                                                },
                                          ),
                                  ),
                                ),
                                Positioned.fill(
                                  child: DecoratedBox(
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        begin: Alignment.topCenter,
                                        end: Alignment.bottomCenter,
                                        colors: [
                                          Colors.black.withAlpha(0),
                                          Colors.black.withAlpha(185),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                                Positioned(
                                  left: DesignSystem.space14,
                                  bottom: DesignSystem.space14,
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: DesignSystem.space12,
                                          vertical: DesignSystem.space6,
                                        ),
                                        decoration: BoxDecoration(
                                          color: DesignSystem.accentOrange,
                                          borderRadius:
                                              DesignSystem.borderSmall,
                                        ),
                                        child: Text(
                                          _selectedSubBreed == null
                                              ? 'Main photo'
                                              : 'Sub-breed photo',
                                          style: const TextStyle(
                                            color: DesignSystem.darkBrown,
                                            fontSize: 11,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ),
                                      if (mainLikes != null) ...[
                                        const SizedBox(
                                          height: DesignSystem.space6,
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: DesignSystem.space8,
                                            vertical: DesignSystem.space4,
                                          ),
                                          decoration: BoxDecoration(
                                            color: Colors.black.withAlpha(120),
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
                                                '${LikesService.formatLikes(mainLikes)} likes',
                                                style: const TextStyle(
                                                  color: Colors.white,
                                                  fontSize: 11,
                                                  fontWeight: FontWeight.w500,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                ),
                                if (_mainImageUrl != null)
                                  Positioned(
                                    right: 12,
                                    top: 12,
                                    child: CircleAvatar(
                                      backgroundColor: DesignSystem.darkBrown
                                          .withAlpha(145),
                                      child: IconButton(
                                        onPressed: () => _togglePhotoFavorite(
                                          _mainImageUrl!,
                                        ),
                                        icon: Icon(
                                          _photoFavorites.contains(
                                                _mainImageUrl!,
                                              )
                                              ? Icons.favorite
                                              : Icons.favorite_border,
                                          color: DesignSystem.accentOrange,
                                        ),
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        ),
                        if (widget.breed.subBreeds.isNotEmpty)
                          SizedBox(
                            height: 52,
                            child: ListView(
                              scrollDirection: Axis.horizontal,
                              padding: const EdgeInsets.symmetric(
                                horizontal: DesignSystem.space16,
                                vertical: DesignSystem.space8,
                              ),
                              children: [
                                Padding(
                                  padding: const EdgeInsets.only(
                                    right: DesignSystem.space8,
                                  ),
                                  child: ChoiceChip(
                                    selected: _selectedSubBreed == null,
                                    label: const Text('All'),
                                    onSelected: (_) {
                                      setState(() {
                                        _selectedSubBreed = null;
                                      });
                                      _loadImages(_currentPath);
                                    },
                                  ),
                                ),
                                ...widget.breed.subBreeds.map(
                                  (sub) => Padding(
                                    padding: const EdgeInsets.only(
                                      right: DesignSystem.space8,
                                    ),
                                    child: ChoiceChip(
                                      selected: _selectedSubBreed == sub,
                                      label: Text(_capitalize(sub)),
                                      onSelected: (_) {
                                        setState(() {
                                          _selectedSubBreed = sub;
                                        });
                                        _loadImages(_currentPath);
                                      },
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        Card(
                          margin: const EdgeInsets.fromLTRB(
                            DesignSystem.space16,
                            DesignSystem.space16,
                            DesignSystem.space16,
                            DesignSystem.space12,
                          ),
                          elevation: 0,
                          color: DesignSystem.cardBg,
                          shape: RoundedRectangleBorder(
                            borderRadius: DesignSystem.borderMedium,
                            side: const BorderSide(
                              color: DesignSystem.surfaceBorder,
                            ),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(DesignSystem.space16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Breed details',
                                  style: DesignSystem.labelLg,
                                ),
                                const SizedBox(height: DesignSystem.space8),
                                Text(
                                  _capitalize(widget.breed.name),
                                  style: DesignSystem.titleMd,
                                ),
                                const SizedBox(height: DesignSystem.space8),
                                Text(
                                  widget.breed.subBreeds.isEmpty
                                      ? 'No sub-breeds'
                                      : 'Varieties: ${widget.breed.subBreeds.map(_capitalize).join(' · ')}',
                                  style: DesignSystem.bodyMd,
                                ),
                                const SizedBox(height: DesignSystem.space12),
                                Wrap(
                                  spacing: DesignSystem.space8,
                                  runSpacing: DesignSystem.space8,
                                  children: [
                                    _MiniTag(
                                      icon: Icons.pets,
                                      label: _isBreedFavorite
                                          ? 'Saved'
                                          : 'Not saved',
                                      color: _isBreedFavorite
                                          ? DesignSystem.success
                                          : DesignSystem.textMuted,
                                    ),
                                    _MiniTag(
                                      icon: Icons.photo_library_outlined,
                                      label: '${_galleryUrls.length} photos',
                                      color: DesignSystem.primaryBrown,
                                    ),
                                    _MiniTag(
                                      icon: Icons.favorite_border,
                                      label:
                                          '${_photoFavorites.length} favorites',
                                      color: DesignSystem.accentOrange,
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: DesignSystem.space16,
                            vertical: DesignSystem.space12,
                          ),
                          child: Row(
                            children: [
                              Expanded(
                                child: FilledButton.icon(
                                  style: DesignSystem.filledButtonStyle,
                                  onPressed: () => _loadImages(_currentPath),
                                  icon: const Icon(Icons.refresh),
                                  label: const Text('Refresh photo'),
                                ),
                              ),
                              const SizedBox(width: DesignSystem.space12),
                              Expanded(
                                child: OutlinedButton.icon(
                                  style: DesignSystem.outlinedButtonStyle,
                                  onPressed: _toggleBreedFavorite,
                                  icon: Icon(
                                    _isBreedFavorite
                                        ? Icons.check
                                        : Icons.bookmark_border,
                                  ),
                                  label: Text(
                                    _isBreedFavorite ? 'Saved' : 'Save breed',
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (_galleryLoading || _galleryUrls.isNotEmpty)
                          Padding(
                            padding: const EdgeInsets.fromLTRB(
                              DesignSystem.space16,
                              DesignSystem.space20,
                              DesignSystem.space16,
                              DesignSystem.space12,
                            ),
                            child: const Text(
                              'Photo gallery · tap to save',
                              style: DesignSystem.labelLg,
                            ),
                          ),
                        if (_galleryLoading)
                          const Padding(
                            padding: EdgeInsets.symmetric(
                              vertical: DesignSystem.space32,
                            ),
                            child: Center(child: CircularProgressIndicator()),
                          )
                        else if (_galleryUrls.isNotEmpty)
                          SizedBox(
                            height: 140,
                            child: ListView.separated(
                              padding: const EdgeInsets.symmetric(
                                horizontal: DesignSystem.space16,
                              ),
                              scrollDirection: Axis.horizontal,
                              itemBuilder: (_, index) {
                                final url = _galleryUrls[index];
                                final liked = _photoFavorites.contains(url);
                                final likes = breedLikes;
                                return ClipRRect(
                                  borderRadius: DesignSystem.borderMedium,
                                  child: Stack(
                                    children: [
                                      SizedBox(
                                        width: 140,
                                        height: 140,
                                        child: Image.network(
                                          url,
                                          fit: BoxFit.cover,
                                          errorBuilder:
                                              (context, error, stackTrace) {
                                                return const ColoredBox(
                                                  color: DesignSystem
                                                      .imagePlaceholder,
                                                  child: Center(
                                                    child: Icon(
                                                      Icons.broken_image,
                                                      color: DesignSystem
                                                          .imageErrorIcon,
                                                    ),
                                                  ),
                                                );
                                              },
                                          loadingBuilder:
                                              (context, child, progress) {
                                                if (progress == null) {
                                                  return child;
                                                }
                                                return const ColoredBox(
                                                  color: DesignSystem
                                                      .imagePlaceholder,
                                                  child: Center(
                                                    child: CircularProgressIndicator(
                                                      strokeWidth: 2,
                                                      valueColor:
                                                          AlwaysStoppedAnimation(
                                                            DesignSystem
                                                                .primaryBrown,
                                                          ),
                                                    ),
                                                  ),
                                                );
                                              },
                                        ),
                                      ),
                                      Positioned.fill(
                                        child: DecoratedBox(
                                          decoration: BoxDecoration(
                                            border: Border.all(
                                              color: Colors.white.withAlpha(
                                                120,
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                      Positioned(
                                        left: DesignSystem.space8,
                                        bottom: DesignSystem.space8,
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: DesignSystem.space8,
                                            vertical: DesignSystem.space4,
                                          ),
                                          decoration: BoxDecoration(
                                            color: Colors.black.withAlpha(120),
                                            borderRadius:
                                                DesignSystem.borderSmall,
                                          ),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              const Icon(
                                                Icons.favorite,
                                                size: 12,
                                                color: Colors.white,
                                              ),
                                              const SizedBox(
                                                width: DesignSystem.space4,
                                              ),
                                              Text(
                                                LikesService.formatLikes(likes),
                                                style: const TextStyle(
                                                  color: Colors.white,
                                                  fontSize: 11,
                                                  fontWeight: FontWeight.w500,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                      Positioned(
                                        top: DesignSystem.space8,
                                        right: DesignSystem.space8,
                                        child: CircleAvatar(
                                          radius: 17,
                                          backgroundColor: DesignSystem
                                              .darkBrown
                                              .withAlpha(145),
                                          child: IconButton(
                                            padding: EdgeInsets.zero,
                                            iconSize: 18,
                                            onPressed: () =>
                                                _togglePhotoFavorite(url),
                                            icon: Icon(
                                              liked
                                                  ? Icons.favorite
                                                  : Icons.favorite_border,
                                              color: DesignSystem.accentOrange,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              },
                              separatorBuilder: (context, index) =>
                                  const SizedBox(width: DesignSystem.space12),
                              itemCount: _galleryUrls.length,
                            ),
                          )
                        else
                          Card(
                            margin: const EdgeInsets.fromLTRB(
                              DesignSystem.space16,
                              DesignSystem.space16,
                              DesignSystem.space16,
                              DesignSystem.space12,
                            ),
                            elevation: 0,
                            color: DesignSystem.cardBg,
                            shape: RoundedRectangleBorder(
                              borderRadius: DesignSystem.borderMedium,
                              side: const BorderSide(
                                color: DesignSystem.surfaceBorder,
                              ),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(
                                DesignSystem.space16,
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Gallery',
                                    style: DesignSystem.labelLg,
                                  ),
                                  const SizedBox(height: DesignSystem.space8),
                                  const Text(
                                    'No gallery photos yet. Refresh to load more photos for this breed.',
                                    style: DesignSystem.bodyMd,
                                  ),
                                  const SizedBox(height: DesignSystem.space12),
                                  OutlinedButton.icon(
                                    style: DesignSystem.outlinedButtonStyle,
                                    onPressed: () => _loadImages(_currentPath),
                                    icon: const Icon(
                                      Icons.photo_library_outlined,
                                    ),
                                    label: const Text('Load Gallery Photos'),
                                  ),
                                ],
                              ),
                            ),
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

class _MiniTag extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;

  const _MiniTag({
    required this.icon,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: DesignSystem.space12,
        vertical: DesignSystem.space6,
      ),
      decoration: BoxDecoration(
        borderRadius: DesignSystem.borderSmall,
        color: color.withAlpha(26),
        border: Border.all(color: color, width: 1.3),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: DesignSystem.space6),
          Text(
            label,
            style: TextStyle(
              color: color,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
