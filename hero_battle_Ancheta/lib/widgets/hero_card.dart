import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../models/hero_model.dart';
import '../router/app_router.dart';

class HeroCard extends StatefulWidget {
  final HeroModel hero;
  final int index;

  const HeroCard({super.key, required this.hero, this.index = 0});

  @override
  State<HeroCard> createState() => _HeroCardState();
}

class _HeroCardState extends State<HeroCard> {
  String? _displayedImageUrl;

  @override
  void didUpdateWidget(covariant HeroCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.hero.id != widget.hero.id) {
      _displayedImageUrl = null;
    }
  }

  void _openDetail() {
    final initialImageUrl = _displayedImageUrl ??
        (widget.hero.imageUrlCandidates.isNotEmpty
            ? widget.hero.imageUrlCandidates.first
            : widget.hero.reliableImageUrl);

    Navigator.pushNamed(
      context,
      RouteNames.heroDetail,
      arguments: HeroDetailArguments(
        hero: widget.hero,
        initialImageUrl: initialImageUrl,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Card(
      clipBehavior: Clip.antiAlias,
      elevation: 4,
      child: InkWell(
        onTap: _openDetail,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              flex: 3,
              child: Hero(
                tag: 'hero_${widget.hero.id}',
                child: _HeroImage(
                  hero: widget.hero,
                  onDisplayedUrlChanged: (url) {
                    if (!mounted) return;
                    setState(() => _displayedImageUrl = url);
                  },
                ),
              ),
            ),
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      widget.hero.name,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: _getAlignmentColor(isDark),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            widget.hero.alignment.toUpperCase(),
                            style: TextStyle(
                              fontSize: 10,
                              color: isDark ? Colors.white : const Color(0xFF111827),
                            ),
                          ),
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            widget.hero.publisher,
                            style: TextStyle(
                              fontSize: 10,
                              color: Colors.grey[600],
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    TweenAnimationBuilder(
                      tween: Tween<double>(begin: 0, end: widget.hero.maxHp / 100),
                      duration: const Duration(milliseconds: 500),
                      builder: (context, value, child) =>
                          LinearProgressIndicator(
                        value: value.clamp(0.0, 1.0),
                        backgroundColor: Colors.grey[300],
                        color: Colors.red,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStatChip('⚔️', widget.hero.attack, theme),
                        _buildStatChip('🛡️', widget.hero.defense, theme),
                        _buildStatChip('💥', widget.hero.specialAttack, theme),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn(duration: 300.ms, delay: (50 * widget.index).ms).slideY(
          begin: 0.2,
          end: 0,
          duration: 400.ms,
          curve: Curves.easeOutQuad,
        );
  }

  Color _getAlignmentColor(bool isDark) {
    switch (widget.hero.alignment.toLowerCase()) {
      case 'good':
        return isDark ? const Color(0xFF3B82F6) : const Color(0xFFBFDBFE);
      case 'bad':
        return isDark ? const Color(0xFFEF4444) : const Color(0xFFFECACA);
      default:
        return isDark ? const Color(0xFF6B7280) : const Color(0xFFE5E7EB);
    }
  }

  Widget _buildStatChip(String icon, int value, ThemeData theme) {
    final isDark = theme.brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
      decoration: BoxDecoration(
        color: isDark
            ? theme.colorScheme.surfaceContainerHighest
            : theme.colorScheme.surfaceContainerLow,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(icon, style: const TextStyle(fontSize: 10)),
          const SizedBox(width: 2),
          Text(
            value.toString(),
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : const Color(0xFF111827),
            ),
          ),
        ],
      ),
    );
  }
}

/// ✅ Stateful widget that walks through the image URL fallback chain:
///    1. hero.imageUrl  (superheroapi.com — best quality, requires valid token)
///    2. hero.cdnImageUrl  (Akabab via jsDelivr CDN — public, no token needed)
///    3. hero.fallbackImageUrl  (local SVG data URL — always works)
///    4. Icon placeholder  (absolute last resort)
class _HeroImage extends StatefulWidget {
  final HeroModel hero;
  final ValueChanged<String>? onDisplayedUrlChanged;

  const _HeroImage({
    required this.hero,
    this.onDisplayedUrlChanged,
  });

  @override
  State<_HeroImage> createState() => _HeroImageState();
}

class _HeroImageState extends State<_HeroImage> {
  static const Alignment _faceAlignment = Alignment(0, -0.28);
  late List<String> _urlQueue;
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _urlQueue = _buildUrlQueue();
    _currentIndex = 0;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _notifyDisplayedUrl();
    });
  }

  @override
  void didUpdateWidget(covariant _HeroImage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.hero.id != widget.hero.id ||
        oldWidget.hero.imageUrl != widget.hero.imageUrl) {
      _urlQueue = _buildUrlQueue();
      _currentIndex = 0;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _notifyDisplayedUrl();
      });
    }
  }

  List<String> _buildUrlQueue() {
    return widget.hero.imageUrlCandidates;
  }

  void _tryNext() {
    if (_currentIndex < _urlQueue.length - 1) {
      setState(() => _currentIndex++);
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _notifyDisplayedUrl();
      });
    }
  }

  void _notifyDisplayedUrl() {
    if (!mounted || _urlQueue.isEmpty) return;
    widget.onDisplayedUrlChanged?.call(_urlQueue[_currentIndex]);
  }

  @override
  Widget build(BuildContext context) {
    if (_urlQueue.isEmpty) return _placeholder(context);

    if (kIsWeb) {
      return Image.network(
        _urlQueue[_currentIndex],
        fit: BoxFit.cover,
        alignment: _faceAlignment,
        filterQuality: FilterQuality.high,
        width: double.infinity,
        frameBuilder: (context, child, frame, wasSynchronouslyLoaded) {
          if (wasSynchronouslyLoaded || frame != null) {
            return _buildImageFrame(child);
          }
          return _loading();
        },
        loadingBuilder: (context, child, progress) {
          if (progress == null) return child;
          return _loading();
        },
        errorBuilder: (context, error, stackTrace) {
          WidgetsBinding.instance.addPostFrameCallback((_) => _tryNext());
          return _placeholder(context);
        },
      );
    }

    return CachedNetworkImage(
      imageUrl: _urlQueue[_currentIndex],
      // ✅ Use cacheKey so each URL is cached independently
      cacheKey: '${widget.hero.id}_$_currentIndex',
      imageBuilder: (context, imageProvider) => _buildImageFrame(
        Image(
          image: imageProvider,
          fit: BoxFit.cover,
          alignment: _faceAlignment,
          filterQuality: FilterQuality.high,
          width: double.infinity,
          height: double.infinity,
        ),
      ),
      placeholder: (context, url) => _loading(),
      errorWidget: (context, url, error) {
        // Try the next URL in the queue
        WidgetsBinding.instance.addPostFrameCallback((_) => _tryNext());
        // Show placeholder while switching
        return _placeholder(context);
      },
    );
  }

  Widget _buildImageFrame(Widget image) {
    return Stack(
      fit: StackFit.expand,
      children: [
        image,
        Positioned(
          left: 0,
          right: 0,
          top: 0,
          height: 34,
          child: IgnorePointer(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withValues(alpha: 0.18),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
        ),
        Positioned(
          left: 0,
          right: 0,
          bottom: 0,
          height: 48,
          child: IgnorePointer(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withValues(alpha: 0.28),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _loading() {
    return Container(
      color: const Color(0xFF1D2430),
      child: const Center(
        child: CircularProgressIndicator(strokeWidth: 2),
      ),
    );
  }

  Widget _placeholder(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF162033) : const Color(0xFFEAF2FF);
    final iconColor = isDark ? const Color(0xFF8CB8FF) : const Color(0xFF1D4ED8);
    final textColor = isDark ? const Color(0xFFD6E4FF) : const Color(0xFF1E3A8A);

    return Container(
      color: bg,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.person,
              size: 40,
              color: iconColor,
            ),
            const SizedBox(height: 4),
            Text(
              widget.hero.name,
              style: TextStyle(
                fontSize: 11,
                color: textColor,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}