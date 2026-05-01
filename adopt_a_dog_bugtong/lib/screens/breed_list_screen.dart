import 'dart:math';
import 'package:adopt_a_dog/design/design_system.dart';
import 'package:adopt_a_dog/models/breed.dart';
import 'package:adopt_a_dog/screens/breed_detail_screen.dart';
import 'package:adopt_a_dog/screens/favorites_screen.dart';
import 'package:adopt_a_dog/services/dog_api_service.dart';
import 'package:adopt_a_dog/services/prefs_service.dart';
import 'package:adopt_a_dog/widgets/dog_network_image.dart';
import 'package:adopt_a_dog/widgets/paw_pattern_layer.dart';
import 'package:flutter/material.dart';

class BreedListScreen extends StatefulWidget {
  const BreedListScreen({super.key});

  @override
  State<BreedListScreen> createState() => _BreedListScreenState();
}

class _BreedListScreenState extends State<BreedListScreen> {
  final DogApiService _dogApi = DogApiService();
  final PrefsService _prefs = PrefsService();
  final TextEditingController _searchController = TextEditingController();
  late Future<void> _screenFuture;
  final Map<String, String> _breedThumbs = <String, String>{};
  final Set<String> _thumbsLoading = <String>{};

  List<Breed> _breeds = const [];
  String? _error;
  String? _heroBreed;
  String? _heroImageUrl;

  @override
  void initState() {
    super.initState();
    _screenFuture = _loadData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    _error = null;

    try {
      final savedSearch = await _prefs.loadLastSearch();
      final breeds = await _dogApi.fetchBreeds();

      String? heroBreed;
      String? heroImage;
      if (breeds.isNotEmpty) {
        final random = breeds[Random().nextInt(breeds.length)];
        heroBreed = random.name;
        heroImage = await _dogApi.fetchRandomImage(random.name);
      }

      if (!mounted) return;
      setState(() {
        _breeds = breeds;
        _heroBreed = heroBreed;
        _heroImageUrl = heroImage;
        _searchController.text = savedSearch;
      });

      for (final breed in breeds.take(20)) {
        _ensureBreedThumbnail(breed.name);
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = 'Failed to load breeds. Please try again.';
      });
      throw Exception(_error);
    }
  }

  Future<void> _refreshHero() async {
    if (_breeds.isEmpty) return;
    final random = _breeds[Random().nextInt(_breeds.length)];
    try {
      final url = await _dogApi.fetchRandomImage(random.name);
      if (!mounted) return;
      setState(() {
        _heroBreed = random.name;
        _heroImageUrl = url;
      });
    } catch (_) {}
  }

  Future<void> _onSearchChanged(String value) async {
    setState(() {});
    await _prefs.saveLastSearch(value);
  }

  void _ensureBreedThumbnail(String breedName) {
    if (_breedThumbs.containsKey(breedName) || _thumbsLoading.contains(breedName)) {
      return;
    }

    _thumbsLoading.add(breedName);
    _dogApi
        .fetchRandomImage(breedName)
        .then((url) {
          if (!mounted) return;
          setState(() {
            _breedThumbs[breedName] = url;
          });
        })
        .catchError((_) {})
        .whenComplete(() {
          _thumbsLoading.remove(breedName);
        });
  }

  void _openBreed(Breed breed) {
    Navigator.push(context, MaterialPageRoute(builder: (_) => BreedDetailScreen(breed: breed)));
  }

  List<Breed> get _filteredBreeds {
    final query = _searchController.text.trim().toLowerCase();
    if (query.isEmpty) return _breeds;
    return _breeds.where((b) => b.name.toLowerCase().contains(query)).toList();
  }

  String _capitalize(String value) {
    if (value.isEmpty) return value;
    return value[0].toUpperCase() + value.substring(1);
  }

  void _onBottomNavTap(int index) {
    if (index == 2) {
      Navigator.push(context, MaterialPageRoute(builder: (_) => const FavoritesScreen()));
      return;
    }
    if (index == 1) {
      _refreshHero();
    }
  }

  Widget _buildNavItem({
    required int index,
    required IconData icon,
    required String label,
    required bool selected,
  }) {
    final color = selected ? DesignSystem.accentOrange : DesignSystem.textMuted.withAlpha(180);
    return Expanded(
      child: InkWell(
        onTap: () => _onBottomNavTap(index),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: DesignSystem.space4),
            Text(
              label,
              style: TextStyle(
                color: color,
                fontSize: 11,
                fontWeight: FontWeight.w600,
                letterSpacing: 0.3,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredBreeds;

    return Scaffold(
      appBar: AppBar(
        titleSpacing: DesignSystem.space20,
        toolbarHeight: 68,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        backgroundColor: DesignSystem.bgCream,
        title: const Text('Adopt-a-Dog', style: DesignSystem.titleXL),
      ),
      body: Stack(
        children: [
          Container(decoration: const BoxDecoration(gradient: DesignSystem.bgGradient)),
          const PawPatternLayer(),
          FutureBuilder<void>(
            future: _screenFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }

              if (snapshot.hasError || _error != null) {
                return Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(_error ?? 'Failed to load breeds. Please try again.'),
                      const SizedBox(height: 12),
                      FilledButton(
                        onPressed: () {
                          setState(() {
                            _screenFuture = _loadData();
                          });
                        },
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                );
              }

              return RefreshIndicator(
                onRefresh: _refreshHero,
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 1200),
                    child: ListView(
                      padding: const EdgeInsets.only(bottom: DesignSystem.space48),
                      children: [
                    Visibility(
                      visible: _searchController.text.trim().isEmpty && _heroBreed != null,
                      maintainState: true,
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(
                          DesignSystem.space16,
                          DesignSystem.space24,
                          DesignSystem.space16,
                          DesignSystem.space8,
                        ),
                        child: GestureDetector(
                          onTap: () {
                            final breed = _breeds.where((b) => b.name == _heroBreed).firstOrNull;
                            if (breed != null) _openBreed(breed);
                          },
                          child: ClipRRect(
                            borderRadius: DesignSystem.borderXL,
                            child: Stack(
                              children: [
                                DecoratedBox(
                                  decoration: BoxDecoration(
                                    borderRadius: DesignSystem.borderXL,
                                    boxShadow: DesignSystem.shadowXL,
                                  ),
                                  child: SizedBox(
                                    height: 220,
                                    width: double.infinity,
                                    child: AnimatedSwitcher(
                                      duration: const Duration(milliseconds: 420),
                                      switchInCurve: Curves.easeOutCubic,
                                      switchOutCurve: Curves.easeInCubic,
                                      transitionBuilder: (child, animation) {
                                        return FadeTransition(
                                          opacity: animation,
                                          child: ScaleTransition(
                                            scale: Tween<double>(
                                              begin: 0.98,
                                              end: 1,
                                            ).animate(animation),
                                            child: child,
                                          ),
                                        );
                                      },
                                      child: _heroImageUrl == null
                                          ? const ColoredBox(
                                              key: ValueKey('hero-empty'),
                                              color: Color(0xFFE8D5BA),
                                            )
                                          : DogNetworkImage(
                                              key: ValueKey(_heroImageUrl),
                                              url: _heroImageUrl!,
                                            ),
                                    ),
                                  ),
                                ),
                                Positioned.fill(
                                  child: DecoratedBox(
                                    decoration: const BoxDecoration(
                                      gradient: DesignSystem.heroOverlay,
                                    ),
                                  ),
                                ),
                                Positioned(
                                  left: DesignSystem.space16,
                                  right: DesignSystem.space16,
                                  bottom: DesignSystem.space16,
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text('DOG OF THE DAY', style: DesignSystem.labelLg),
                                      const SizedBox(height: DesignSystem.space8),
                                      Text(
                                        _capitalize(_heroBreed!),
                                        style: DesignSystem.displayLarge,
                                      ),
                                      const SizedBox(height: DesignSystem.space8),
                                      const Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(
                                            Icons.arrow_forward_ios,
                                            size: 12,
                                            color: Colors.white,
                                          ),
                                          SizedBox(width: DesignSystem.space4),
                                          Text(
                                            'Tap to explore',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontWeight: FontWeight.w500,
                                              fontSize: 13,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                                Positioned(
                                  top: 12,
                                  right: 12,
                                  child: CircleAvatar(
                                    backgroundColor: Colors.black.withAlpha(90),
                                    child: IconButton(
                                      icon: const Icon(Icons.refresh, color: Colors.white),
                                      onPressed: _refreshHero,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(
                        DesignSystem.space16,
                        DesignSystem.space12,
                        DesignSystem.space16,
                        DesignSystem.space12,
                      ),
                      child: TextField(
                        controller: _searchController,
                        onChanged: _onSearchChanged,
                        decoration: InputDecoration(
                          hintText: 'Search ${_breeds.length} breeds...',
                          hintStyle: const TextStyle(color: DesignSystem.textMuted, fontSize: 15),
                          prefixIcon: const Icon(
                            Icons.search,
                            color: DesignSystem.textMuted,
                            size: 20,
                          ),
                          suffixIcon: _searchController.text.isEmpty
                              ? null
                              : IconButton(
                                  icon: const Icon(Icons.close, size: 20),
                                  onPressed: () {
                                    _searchController.clear();
                                    _onSearchChanged('');
                                  },
                                ),
                          filled: true,
                          fillColor: Colors.white,
                          contentPadding: const EdgeInsets.symmetric(
                            vertical: DesignSystem.space12,
                            horizontal: DesignSystem.space14,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: DesignSystem.borderMedium,
                            borderSide: const BorderSide(color: Color(0xFFDCCDBA), width: 1.5),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: DesignSystem.borderMedium,
                            borderSide: const BorderSide(color: Color(0xFFDCCDBA), width: 1.5),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: DesignSystem.borderMedium,
                            borderSide: const BorderSide(
                              color: DesignSystem.primaryBrown,
                              width: 2,
                            ),
                          ),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(
                        DesignSystem.space20,
                        DesignSystem.space12,
                        DesignSystem.space20,
                        DesignSystem.space12,
                      ),
                      child: Text(
                        _searchController.text.trim().isEmpty
                            ? 'ALL BREEDS (${_breeds.length})'
                            : '${filtered.length} RESULT${filtered.length == 1 ? '' : 'S'}',
                        style: DesignSystem.labelLg,
                      ),
                    ),
                    if (filtered.isEmpty)
                      Padding(
                        padding: const EdgeInsets.all(DesignSystem.space32),
                        child: Center(child: Text('No breeds found.', style: DesignSystem.bodyMd)),
                      )
                    else
                      ...filtered.map(
                        (breed) => Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: DesignSystem.space12,
                            vertical: DesignSystem.space6,
                          ),
                          child: Builder(
                            builder: (context) {
                              _ensureBreedThumbnail(breed.name);
                              return _AnimatedBreedTile(
                                breedName: _capitalize(breed.name),
                                subtitle: breed.subBreeds.isEmpty
                                    ? null
                                    : '${breed.subBreeds.length} ${breed.subBreeds.length == 1 ? 'sub-breed' : 'sub-breeds'}',
                                imageUrl: _breedThumbs[breed.name],
                                onTap: () => _openBreed(breed),
                              );
                            },
                          ),
                        ),
                      ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
      bottomNavigationBar: Container(
        height: 74,
        decoration: const BoxDecoration(
          color: DesignSystem.darkBrown,
          boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 12, offset: Offset(0, -2))],
        ),
        child: Row(
          children: [
            _buildNavItem(index: 0, icon: Icons.pets, label: 'Breeds', selected: true),
            _buildNavItem(
              index: 1,
              icon: Icons.explore_outlined,
              label: 'Explore',
              selected: false,
            ),
            _buildNavItem(
              index: 2,
              icon: Icons.favorite_border,
              label: 'Favorites',
              selected: false,
            ),
          ],
        ),
      ),
    );
  }
}

class _AnimatedBreedTile extends StatefulWidget {
  final String breedName;
  final String? subtitle;
  final String? imageUrl;
  final VoidCallback onTap;

  const _AnimatedBreedTile({
    required this.breedName,
    required this.subtitle,
    required this.imageUrl,
    required this.onTap,
  });

  @override
  State<_AnimatedBreedTile> createState() => _AnimatedBreedTileState();
}

class _AnimatedBreedTileState extends State<_AnimatedBreedTile> {
  bool _hovered = false;
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: AnimatedScale(
        duration: DesignSystem.durationQuick,
        curve: DesignSystem.curveEaseOut,
        scale: _pressed ? 0.985 : (_hovered ? 1.01 : 1),
        child: AnimatedContainer(
          duration: DesignSystem.durationQuick,
          curve: DesignSystem.curveEaseOut,
          decoration: BoxDecoration(
            borderRadius: DesignSystem.borderMedium,
            boxShadow: _hovered ? DesignSystem.shadowMedium : DesignSystem.shadowSmall,
            color: DesignSystem.cardBg,
          ),
          child: ClipRRect(
            borderRadius: DesignSystem.borderMedium,
            child: InkWell(
              onTap: widget.onTap,
              onHighlightChanged: (value) => setState(() => _pressed = value),
              hoverColor: const Color(0x08A56932),
              splashColor: const Color(0x18A56932),
              child: ListTile(
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: DesignSystem.space16,
                  vertical: DesignSystem.space8,
                ),
                minVerticalPadding: DesignSystem.space12,
                leading: AnimatedSwitcher(
                  duration: DesignSystem.durationNormal,
                  child: widget.imageUrl == null
                      ? CircleAvatar(
                          key: const ValueKey('tile-loading'),
                          radius: 24,
                          backgroundColor: const Color(0xFFE8D5BA),
                          child: const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation(DesignSystem.primaryBrown),
                            ),
                          ),
                        )
                      : ClipOval(
                          key: ValueKey('tile-image-${widget.imageUrl}'),
                          child: SizedBox(
                            width: 48,
                            height: 48,
                            child: DogNetworkImage(url: widget.imageUrl!),
                          ),
                        ),
                ),
                title: Text(
                  widget.breedName,
                  style: DesignSystem.titleMd,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                subtitle: widget.subtitle == null
                    ? null
                    : Text(
                        widget.subtitle!,
                        style: DesignSystem.bodyMd,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                trailing: AnimatedContainer(
                  duration: DesignSystem.durationQuick,
                  curve: DesignSystem.curveEaseOut,
                  transform: Matrix4.translationValues(_hovered ? DesignSystem.space4 : 0, 0, 0),
                  child: Icon(
                    Icons.chevron_right,
                    color: DesignSystem.textSecondary.withAlpha(180),
                    size: 24,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
