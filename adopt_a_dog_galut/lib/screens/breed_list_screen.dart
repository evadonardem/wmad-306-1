import 'dart:math';
import 'package:adopt_a_dog/design/design_system.dart';
import 'package:adopt_a_dog/models/breed.dart';
import 'package:adopt_a_dog/screens/breed_detail_screen.dart';
import 'package:adopt_a_dog/screens/explore_screen.dart';
import 'package:adopt_a_dog/screens/favorites_screen.dart';
import 'package:adopt_a_dog/services/dog_api_service.dart';
import 'package:adopt_a_dog/services/likes_service.dart';
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
  List<MapEntry<String, int>> _topLikedDogs = <MapEntry<String, int>>[];
  String? _error;

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
      final topLikedDogs = _buildTopLikedDogs(breeds);

      if (!mounted) return;
      setState(() {
        _breeds = breeds;
        _topLikedDogs = topLikedDogs;
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

  List<MapEntry<String, int>> _buildTopLikedDogs(List<Breed> breeds) {
    final ranked = breeds
        .map(
          (breed) =>
              MapEntry(breed.name, LikesService.likesForBreed(breed.name)),
        )
        .toList();
    ranked.sort((a, b) => b.value.compareTo(a.value));
    return ranked;
  }

  Future<void> _refreshTopLikedDogs() async {
    if (_breeds.isNotEmpty) {
      setState(() {
        _topLikedDogs = _buildTopLikedDogs(_breeds);
      });
      return;
    }

    try {
      final breeds = await _dogApi.fetchBreeds();
      if (!mounted) return;
      setState(() {
        _breeds = breeds;
        _topLikedDogs = _buildTopLikedDogs(breeds);
      });
    } catch (_) {
      // Keep existing UI if fetching fresh breeds fails.
    }
  }

  Future<void> _showTopLikedDogsSheet() async {
    await _refreshTopLikedDogs();
    if (!mounted) return;

    final rankedDogs = _topLikedDogs;
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return SafeArea(
          child: SizedBox(
            height: MediaQuery.of(context).size.height * 0.72,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Top liked dogs', style: DesignSystem.titleLg),
                  const SizedBox(height: DesignSystem.space4),
                  Text(
                    'Sorted from highest to lowest likes',
                    style: DesignSystem.bodyMd.copyWith(
                      color: DesignSystem.textSecondary,
                    ),
                  ),
                  const SizedBox(height: DesignSystem.space12),
                  Expanded(
                    child: rankedDogs.isEmpty
                        ? Center(
                            child: Text(
                              'Could not build top list right now. Try again.',
                              textAlign: TextAlign.center,
                              style: DesignSystem.bodyMd,
                            ),
                          )
                        : ListView.separated(
                            itemCount: min(rankedDogs.length, 20),
                            separatorBuilder: (context, index) =>
                                const Divider(height: 1),
                            itemBuilder: (context, index) {
                              final item = rankedDogs[index];
                              final breedName = item.key;
                              final likes = item.value;
                              final breed = _breeds
                                  .where((b) => b.name == breedName)
                                  .firstOrNull;

                              return ListTile(
                                contentPadding: const EdgeInsets.symmetric(
                                  horizontal: DesignSystem.space4,
                                ),
                                onTap: breed == null
                                    ? null
                                    : () {
                                        Navigator.pop(context);
                                        _openBreed(breed);
                                      },
                                leading: CircleAvatar(
                                  radius: 15,
                                  backgroundColor: DesignSystem.accentOrange
                                      .withAlpha(28),
                                  child: Text(
                                    '${index + 1}',
                                    style: const TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: DesignSystem.textPrimary,
                                    ),
                                  ),
                                ),
                                title: Text(
                                  _capitalize(breedName),
                                  style: DesignSystem.bodyLg,
                                ),
                                trailing: SizedBox(
                                  width: 120,
                                  child: Text(
                                    '${LikesService.formatLikes(likes)} likes',
                                    textAlign: TextAlign.right,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: DesignSystem.bodyMd.copyWith(
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Future<void> _onSearchChanged(String value) async {
    setState(() {});
    await _prefs.saveLastSearch(value);
  }

  void _ensureBreedThumbnail(String breedName) {
    if (_breedThumbs.containsKey(breedName) ||
        _thumbsLoading.contains(breedName)) {
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
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => BreedDetailScreen(breed: breed)),
    );
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
    if (index == 1) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const ExploreScreen()),
      );
      return;
    }
    if (index == 2) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const FavoritesScreen()),
      );
      return;
    }
  }

  Widget _buildNavItem({
    required int index,
    required IconData icon,
    required String label,
    required bool selected,
  }) {
    final color = selected
        ? DesignSystem.primaryBrown
        : DesignSystem.textSecondary;
    return Expanded(
      child: InkWell(
        borderRadius: DesignSystem.borderMedium,
        onTap: () => _onBottomNavTap(index),
        child: AnimatedContainer(
          duration: DesignSystem.durationQuick,
          margin: const EdgeInsets.symmetric(horizontal: DesignSystem.space4),
          padding: const EdgeInsets.symmetric(vertical: DesignSystem.space8),
          decoration: BoxDecoration(
            borderRadius: DesignSystem.borderMedium,
            color: selected
                ? DesignSystem.accentOrange.withAlpha(30)
                : Colors.transparent,
            border: Border.all(
              color: selected
                  ? DesignSystem.accentOrange.withAlpha(120)
                  : DesignSystem.surfaceBorder,
              width: 1,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: color, size: 20),
              const SizedBox(height: DesignSystem.space4),
              Text(
                label,
                style: TextStyle(
                  color: color,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.2,
                ),
              ),
            ],
          ),
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
        backgroundColor: Colors.transparent,
        title: const Text('Dogs', style: DesignSystem.titleXL),
        actions: [
          IconButton(
            onPressed: () => _onBottomNavTap(2),
            icon: const Icon(Icons.collections_bookmark_outlined),
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
                      Text(
                        _error ?? 'Failed to load breeds. Please try again.',
                        style: DesignSystem.bodyMd,
                      ),
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
                onRefresh: _loadData,
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 1200),
                    child: ListView(
                      padding: const EdgeInsets.only(
                        bottom: DesignSystem.space48,
                      ),
                      children: [
                        Padding(
                          padding: const EdgeInsets.fromLTRB(
                            DesignSystem.space16,
                            DesignSystem.space12,
                            DesignSystem.space16,
                            DesignSystem.space12,
                          ),
                          child: Container(
                            decoration: BoxDecoration(
                              color: DesignSystem.cardBg,
                              borderRadius: DesignSystem.borderMedium,
                              border: Border.all(
                                color: DesignSystem.surfaceBorder,
                                width: 1,
                              ),
                              boxShadow: DesignSystem.shadowSmall,
                            ),
                            child: TextField(
                              controller: _searchController,
                              onChanged: _onSearchChanged,
                              decoration: InputDecoration(
                                hintText:
                                    'Find a breed from ${_breeds.length} entries',
                                filled: false,
                                border: InputBorder.none,
                                enabledBorder: InputBorder.none,
                                focusedBorder: InputBorder.none,
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
                                ? 'All breeds (${_breeds.length})'
                                : '${filtered.length} result${filtered.length == 1 ? '' : 's'}',
                            style: DesignSystem.labelLg.copyWith(
                              color: DesignSystem.textSecondary,
                              fontSize: 12,
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(
                            DesignSystem.space16,
                            DesignSystem.space4,
                            DesignSystem.space16,
                            DesignSystem.space12,
                          ),
                          child: Align(
                            alignment: Alignment.centerLeft,
                            child: OutlinedButton.icon(
                              onPressed: _showTopLikedDogsSheet,
                              icon: const Icon(Icons.leaderboard_outlined),
                              label: const Text('Show Top Liked Dogs'),
                            ),
                          ),
                        ),
                        if (filtered.isEmpty)
                          Padding(
                            padding: const EdgeInsets.all(DesignSystem.space32),
                            child: Center(
                              child: Text(
                                'No breeds found.',
                                style: DesignSystem.bodyMd,
                              ),
                            ),
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
        height: 84,
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: DesignSystem.borderLarge,
          border: Border.all(color: DesignSystem.surfaceBorder, width: 1),
          boxShadow: DesignSystem.shadowSmall,
        ),
        child: Row(
          children: [
            _buildNavItem(
              index: 0,
              icon: Icons.pets,
              label: 'Breeds',
              selected: true,
            ),
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
        scale: _pressed ? 0.985 : (_hovered ? 1.006 : 1),
        child: AnimatedContainer(
          duration: DesignSystem.durationQuick,
          curve: DesignSystem.curveEaseOut,
          decoration: BoxDecoration(
            borderRadius: DesignSystem.borderMedium,
            boxShadow: _hovered
                ? DesignSystem.shadowMedium
                : DesignSystem.shadowSmall,
            color: DesignSystem.cardBg,
            border: Border.all(color: DesignSystem.surfaceBorder, width: 1),
          ),
          child: ClipRRect(
            borderRadius: DesignSystem.borderMedium,
            child: InkWell(
              onTap: widget.onTap,
              onHighlightChanged: (value) => setState(() => _pressed = value),
              hoverColor: Colors.black.withAlpha(8),
              splashColor: Colors.black.withAlpha(20),
              child: Row(
                children: [
                  Expanded(
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: DesignSystem.space14,
                        vertical: DesignSystem.space8,
                      ),
                      minVerticalPadding: DesignSystem.space12,
                      leading: AnimatedSwitcher(
                        duration: DesignSystem.durationNormal,
                        child: widget.imageUrl == null
                            ? Container(
                                key: const ValueKey('tile-loading'),
                                width: 52,
                                height: 52,
                                decoration: BoxDecoration(
                                  borderRadius: DesignSystem.borderSmall,
                                  color: DesignSystem.imagePlaceholder,
                                ),
                                child: const SizedBox(
                                  width: 18,
                                  height: 18,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation(
                                      DesignSystem.primaryBrown,
                                    ),
                                  ),
                                ),
                              )
                            : ClipRRect(
                                key: ValueKey('tile-image-${widget.imageUrl}'),
                                borderRadius: DesignSystem.borderSmall,
                                child: SizedBox(
                                  width: 52,
                                  height: 52,
                                  child: DogNetworkImage(url: widget.imageUrl!),
                                ),
                              ),
                      ),
                      title: Text(
                        widget.breedName,
                        style: DesignSystem.titleSm,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      subtitle: widget.subtitle == null
                          ? null
                          : Text(
                              widget.subtitle!,
                              style: DesignSystem.bodyMd.copyWith(fontSize: 13),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                      trailing: AnimatedContainer(
                        duration: DesignSystem.durationQuick,
                        curve: DesignSystem.curveEaseOut,
                        transform: Matrix4.translationValues(
                          _hovered ? DesignSystem.space4 : 0,
                          0,
                          0,
                        ),
                        child: Icon(
                          Icons.chevron_right_rounded,
                          color: DesignSystem.textMuted,
                          size: 24,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
