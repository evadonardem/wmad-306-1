import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../models/dog.dart';

/// M3-compliant dog card with hero image, tonal badges, and smooth interactions.
class DogCard extends StatefulWidget {
  const DogCard({
    super.key,
    required this.dog,
    required this.onTap,
    required this.isFavorite,
    required this.onToggleFavorite,
  });

  final DogSummary dog;
  final VoidCallback onTap;
  final bool isFavorite;
  final VoidCallback onToggleFavorite;

  @override
  State<DogCard> createState() => _DogCardState();
}

class _DogCardState extends State<DogCard> {
  bool _pressed = false;
  bool _lifted = false;

  void _setPressed(bool v) {
    if (_pressed == v) return;
    setState(() => _pressed = v);
  }

  void _setLifted(bool v) {
    if (_lifted == v) return;
    setState(() => _lifted = v);
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final scale = _pressed ? 0.98 : (_lifted ? 1.02 : 1.0);
    final elevation = _lifted ? 8.0 : (_pressed ? 2.0 : 4.0);

    return MouseRegion(
      onEnter: (_) => _setLifted(true),
      onExit: (_) => _setLifted(false),
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: (_) => _setPressed(true),
        onTapCancel: () => _setPressed(false),
        onTapUp: (_) => _setPressed(false),
        onTap: () {
          HapticFeedback.mediumImpact();
          widget.onTap();
        },
        onLongPress: () => _setLifted(true),
        onLongPressEnd: (_) => _setLifted(false),
        child: AnimatedScale(
          scale: scale,
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeOutCubic,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 250),
            decoration: BoxDecoration(
              color: colorScheme.surface,
              borderRadius: BorderRadius.circular(28),
              border: Border.all(
                color: colorScheme.outlineVariant,
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: elevation,
                  offset: Offset(0, elevation * 0.5),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(28),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _photo(context),
                  Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 16,
                    ),
                    child: _info(context),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _photo(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return AspectRatio(
      aspectRatio: 4 / 3,
      child: Stack(
        fit: StackFit.expand,
        children: [
          Hero(
            tag: 'dog-photo-${widget.dog.id}',
            child: CachedNetworkImage(
              imageUrl: widget.dog.thumbnailUrl,
              fit: BoxFit.cover,
              placeholder: (_, _) => Container(
                color: colorScheme.surfaceContainerHighest,
              ),
              errorWidget: (_, _, _) => Container(
                color: colorScheme.surfaceContainerHighest,
                child: Icon(
                  Icons.image_not_supported_outlined,
                  color: colorScheme.outline,
                ),
              ),
            ),
          ),
          // Gradient overlay for text readability
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.center,
                  colors: [
                    Colors.black.withOpacity(0.24),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
          // Favorite button with M3 styling
          Positioned(
            top: 12,
            right: 12,
            child: _favoriteButton(context),
          ),
          // Primary trait badge
          Positioned(
            bottom: 12,
            left: 12,
            child: _traitBadge(context),
          ),
        ],
      ),
    );
  }

  Widget _favoriteButton(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.95),
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.12),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        shape: const CircleBorder(),
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: () {
            HapticFeedback.lightImpact();
            widget.onToggleFavorite();
          },
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 250),
              transitionBuilder: (child, anim) =>
                  ScaleTransition(scale: anim, child: child),
              child: Icon(
                widget.isFavorite ? Icons.favorite : Icons.favorite_border,
                key: ValueKey(widget.isFavorite),
                color: widget.isFavorite
                    ? colorScheme.secondary
                    : colorScheme.outline,
                size: 20,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _traitBadge(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: colorScheme.tertiaryContainer,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.12),
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Text(
        widget.dog.primaryTrait,
        style: Theme.of(context).textTheme.labelSmall?.copyWith(
          color: colorScheme.onTertiaryContainer,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _info(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Dog name
        Text(
          widget.dog.name,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.w600,
            color: colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: 6),
        // Breed
        Text(
          widget.dog.breed,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: textTheme.bodyMedium?.copyWith(
            color: colorScheme.onSurfaceVariant,
          ),
        ),
        const SizedBox(height: 12),
        // Badges for age and size
        Row(
          mainAxisSize: MainAxisSize.min,
          spacing: 8,
          children: [
            _infoBadge(
              context,
              Icons.cake_outlined,
              '${widget.dog.age} ${widget.dog.age == 1 ? 'year' : 'years'}',
            ),
            _infoBadge(
              context,
              Icons.straighten,
              widget.dog.size,
            ),
          ],
        ),
      ],
    );
  }

  Widget _infoBadge(
    BuildContext context,
    IconData icon,
    String label,
  ) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: 6,
        children: [
          Icon(
            icon,
            size: 14,
            color: colorScheme.onSurfaceVariant,
          ),
          Text(
            label,
            style: textTheme.labelSmall?.copyWith(
              color: colorScheme.onSurfaceVariant,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
