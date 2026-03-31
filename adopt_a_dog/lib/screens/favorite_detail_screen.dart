import 'package:adopt_a_dog/models/favorite_dog.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

class FavoriteDetailEntry {
  final FavoriteDog favorite;
  final String description;
  final int originalIndex;

  const FavoriteDetailEntry({
    required this.favorite,
    required this.description,
    required this.originalIndex,
  });
}

class FavoriteDetailScreen extends StatefulWidget {
  final List<FavoriteDetailEntry> entries;
  final int initialIndex;
  final ValueChanged<int> onDelete;

  const FavoriteDetailScreen({
    super.key,
    required this.entries,
    required this.initialIndex,
    required this.onDelete,
  });

  @override
  State<FavoriteDetailScreen> createState() => _FavoriteDetailScreenState();
}

class _FavoriteDetailScreenState extends State<FavoriteDetailScreen> {
  late final PageController _pageController;
  late int _currentIndex;

  FavoriteDetailEntry get _currentEntry => widget.entries[_currentIndex];

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: widget.initialIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _handleDelete() {
    widget.onDelete(_currentEntry.originalIndex);
    Navigator.pop(context, true);
  }

  Future<void> _openFullscreenViewer() async {
    final newIndex = await Navigator.push<int>(
      context,
      PageRouteBuilder<int>(
        opaque: false,
        pageBuilder: (context, animation, secondaryAnimation) {
          return _FullscreenFavoriteViewer(
            entries: widget.entries,
            initialIndex: _currentIndex,
          );
        },
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
      ),
    );

    if (newIndex != null && mounted && newIndex != _currentIndex) {
      _pageController.jumpToPage(newIndex);
      setState(() {
        _currentIndex = newIndex;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentEntry = _currentEntry;

    return Scaffold(
      backgroundColor: const Color(0xFF171717),
      appBar: AppBar(
        title: Text(currentEntry.favorite.displayName),
        actions: [
          IconButton(
            onPressed: _handleDelete,
            icon: const Icon(Icons.delete),
            tooltip: 'Delete favorite',
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(24),
                  child: Container(
                    color: const Color(0xFF242424),
                    child: Stack(
                      children: [
                        PageView.builder(
                          controller: _pageController,
                          onPageChanged: (index) {
                            setState(() {
                              _currentIndex = index;
                            });
                          },
                          itemCount: widget.entries.length,
                          itemBuilder: (context, index) {
                            final entry = widget.entries[index];

                            return GestureDetector(
                              behavior: HitTestBehavior.opaque,
                              onTap: _openFullscreenViewer,
                              child: InteractiveViewer(
                                minScale: 1,
                                maxScale: 4,
                                child: Center(
                                  child: CachedNetworkImage(
                                    imageUrl: entry.favorite.imageUrl,
                                    fit: BoxFit.contain,
                                    placeholder: (context, url) {
                                      return const Center(
                                        child: CircularProgressIndicator(),
                                      );
                                    },
                                    errorWidget: (context, url, error) {
                                      return const Center(
                                        child: Icon(
                                          Icons.broken_image,
                                          size: 64,
                                          color: Colors.white70,
                                        ),
                                      );
                                    },
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                        if (widget.entries.length > 1)
                          Positioned(
                            left: 0,
                            right: 0,
                            bottom: 16,
                            child: Center(
                              child: DecoratedBox(
                                decoration: BoxDecoration(
                                  color: Colors.black.withValues(alpha: 0.45),
                                  borderRadius: BorderRadius.circular(999),
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 14,
                                    vertical: 8,
                                  ),
                                  child: Text(
                                    '${_currentIndex + 1} / ${widget.entries.length}',
                                    style: const TextStyle(color: Colors.white),
                                  ),
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
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 20),
              child: Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: const Color(0xFF242424),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      currentEntry.favorite.displayName,
                      style: Theme.of(
                        context,
                      ).textTheme.headlineSmall?.copyWith(color: Colors.white),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      currentEntry.description,
                      style: Theme.of(
                        context,
                      ).textTheme.bodyLarge?.copyWith(color: Colors.white70),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FullscreenFavoriteViewer extends StatefulWidget {
  final List<FavoriteDetailEntry> entries;
  final int initialIndex;

  const _FullscreenFavoriteViewer({
    required this.entries,
    required this.initialIndex,
  });

  @override
  State<_FullscreenFavoriteViewer> createState() =>
      _FullscreenFavoriteViewerState();
}

class _FullscreenFavoriteViewerState extends State<_FullscreenFavoriteViewer> {
  late final PageController _pageController;
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: widget.initialIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.black.withValues(alpha: 0.94),
      child: SafeArea(
        child: Stack(
          children: [
            GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: () => Navigator.pop(context, _currentIndex),
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: (index) {
                  setState(() {
                    _currentIndex = index;
                  });
                },
                itemCount: widget.entries.length,
                itemBuilder: (context, index) {
                  final entry = widget.entries[index];

                  return Center(
                    child: InteractiveViewer(
                      minScale: 1,
                      maxScale: 4,
                      child: CachedNetworkImage(
                        imageUrl: entry.favorite.imageUrl,
                        fit: BoxFit.contain,
                        placeholder: (context, url) {
                          return const Center(
                            child: CircularProgressIndicator(),
                          );
                        },
                        errorWidget: (context, url, error) {
                          return const Center(
                            child: Icon(
                              Icons.broken_image,
                              size: 64,
                              color: Colors.white70,
                            ),
                          );
                        },
                      ),
                    ),
                  );
                },
              ),
            ),
            Positioned(
              top: 16,
              right: 16,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.45),
                  shape: BoxShape.circle,
                ),
                child: IconButton(
                  onPressed: () => Navigator.pop(context, _currentIndex),
                  icon: const Icon(Icons.close, color: Colors.white),
                ),
              ),
            ),
            if (widget.entries.length > 1)
              Positioned(
                left: 0,
                right: 0,
                bottom: 24,
                child: Center(
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.45),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 8,
                      ),
                      child: Text(
                        '${_currentIndex + 1} / ${widget.entries.length}',
                        style: const TextStyle(color: Colors.white),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
