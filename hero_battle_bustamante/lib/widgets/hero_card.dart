import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/hero_model.dart';
import '../theme/cyber_theme.dart';

class HeroCard extends StatefulWidget {
  final HeroModel hero;
  final VoidCallback? onTap;
  final bool selected;

  const HeroCard({
    super.key,
    required this.hero,
    this.onTap,
    this.selected = false,
  });

  @override
  State<HeroCard> createState() => _HeroCardState();
}

class _HeroCardState extends State<HeroCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _glowController;

  @override
  void initState() {
    super.initState();
    _glowController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _glowController.dispose();
    super.dispose();
  }

  Color get _glowColor {
    switch (widget.hero.alignment) {
      case 'good':
        return CyberColors.alignGood;
      case 'bad':
        return CyberColors.alignBad;
      default:
        return CyberColors.alignNeutral;
    }
  }

  ({String label, Color color, Color glowColor}) get _rarity =>
      getRarityTier(_totalPower);

  int get _totalPower =>
      widget.hero.hp +
      widget.hero.attack +
      widget.hero.defense +
      widget.hero.specialAttack +
      widget.hero.speed;

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final rarity = _rarity;
    final rarityColor = rarity.color;

    return GestureDetector(
      onTap: widget.onTap,
      child: AnimatedBuilder(
        animation: _glowController,
        builder: (context, child) {
          final t = _glowController.value;
          return Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: widget.selected
                    ? cs.primary
                    : Color.lerp(
                        rarityColor.withValues(alpha: 0.15),
                        rarityColor.withValues(alpha: 0.6),
                        t,
                      )!,
                width: widget.selected ? 2.5 : 1.2,
              ),
              color: cs.surfaceContainerHighest,
              boxShadow: [
                BoxShadow(
                  color: rarityColor.withValues(alpha: 0.08 + t * 0.18),
                  blurRadius: 10 + t * 14,
                  spreadRadius: t * 2,
                  offset: const Offset(0, 2),
                ),
                if (widget.selected)
                  BoxShadow(
                    color: cs.primary.withValues(alpha: 0.4),
                    blurRadius: 20,
                  ),
              ],
            ),
            child: Stack(
              children: [
                child!,
                // Holographic shimmer overlay
                Positioned.fill(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(13),
                    child: IgnorePointer(
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment(-1.0 + t * 2, -1.0),
                            end: Alignment(1.0, 1.0 - t * 2),
                            colors: [
                              Colors.transparent,
                              rarityColor.withValues(alpha: 0.06),
                              cs.primary.withValues(alpha: 0.03),
                              Colors.transparent,
                            ],
                            stops: const [0.0, 0.3, 0.7, 1.0],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
        child: ClipRRect(
          borderRadius: BorderRadius.circular(13),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Hero image with gradient overlay
              Expanded(
                flex: 4,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    widget.hero.imageUrl.isNotEmpty
                        ? CachedNetworkImage(
                            imageUrl: widget.hero.imageUrl,
                            fit: BoxFit.cover,
                            httpHeaders: const {
                              'User-Agent': 'Mozilla/5.0',
                            },
                            placeholder: (ctx, url) => Container(
                              color: cs.surfaceContainerHighest,
                              child: Center(
                                child: SizedBox(
                                  width: 22,
                                  height: 22,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: cs.primary.withValues(alpha: 0.4),
                                  ),
                                ),
                              ),
                            ),
                            errorWidget: (ctx, url, err) =>
                                _buildImageFallback(cs),
                          )
                        : _buildImageFallback(cs),
                    // Gradient overlay
                    Positioned.fill(
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.transparent,
                              Colors.transparent,
                              cs.surfaceContainerHighest
                                  .withValues(alpha: 0.7),
                              cs.surfaceContainerHighest,
                            ],
                            stops: const [0.0, 0.4, 0.8, 1.0],
                          ),
                        ),
                      ),
                    ),
                    // Alignment badge
                    if (widget.hero.alignment != 'unknown' &&
                        widget.hero.alignment.isNotEmpty)
                      Positioned(
                        top: 6,
                        right: 6,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 7, vertical: 3),
                          decoration: BoxDecoration(
                            color: _glowColor.withValues(alpha: 0.9),
                            borderRadius: BorderRadius.circular(6),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.3),
                                blurRadius: 4,
                              ),
                            ],
                          ),
                          child: Text(
                            widget.hero.alignment.toUpperCase(),
                            style: GoogleFonts.rajdhani(
                              color: Colors.white,
                              fontSize: 9,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),
                      ),
                    // Rarity + power badge
                    Positioned(
                      top: 6,
                      left: 6,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 7, vertical: 3),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.65),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(
                            color: rarityColor.withValues(alpha: 0.4),
                            width: 0.5,
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.bolt_rounded,
                                size: 10, color: rarityColor),
                            const SizedBox(width: 2),
                            Text(
                              '$_totalPower',
                              style: GoogleFonts.rajdhani(
                                color: rarityColor,
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // Info section
              Expanded(
                flex: 2,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(10, 6, 10, 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        widget.hero.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style:
                            Theme.of(context).textTheme.titleSmall?.copyWith(
                                  fontWeight: FontWeight.w800,
                                  fontSize: 13,
                                ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        widget.hero.publisher,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style:
                            Theme.of(context).textTheme.bodySmall?.copyWith(
                                  color: cs.onSurface.withValues(alpha: 0.45),
                                  fontSize: 10,
                                ),
                      ),
                      const SizedBox(height: 6),
                      // Mini stat bar
                      Row(
                        children: [
                          _StatDot(
                              icon: Icons.favorite_rounded,
                              value: widget.hero.hp,
                              color: CyberColors.hp),
                          const SizedBox(width: 6),
                          _StatDot(
                              icon: Icons.flash_on_rounded,
                              value: widget.hero.attack,
                              color: CyberColors.attack),
                          const SizedBox(width: 6),
                          _StatDot(
                              icon: Icons.shield_rounded,
                              value: widget.hero.defense,
                              color: CyberColors.defense),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    ).animate().fadeIn(duration: 300.ms).scale(
          begin: const Offset(0.95, 0.95),
          end: const Offset(1.0, 1.0),
          duration: 300.ms,
          curve: Curves.easeOut,
        );
  }

  Widget _buildImageFallback(ColorScheme cs) {
    return Container(
      decoration: BoxDecoration(
        color: cs.surfaceContainerHighest,
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            _rarity.color.withValues(alpha: 0.1),
            cs.surfaceContainerHighest,
          ],
        ),
      ),
      child: Center(
        child: Icon(Icons.person_rounded,
            size: 44, color: cs.onSurface.withValues(alpha: 0.15)),
      ),
    );
  }
}

class _StatDot extends StatelessWidget {
  final IconData icon;
  final int value;
  final Color color;

  const _StatDot(
      {required this.icon, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 10, color: color.withValues(alpha: 0.8)),
        const SizedBox(width: 2),
        Text(
          '$value',
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w700,
            color: color.withValues(alpha: 0.9),
          ),
        ),
      ],
    );
  }
}
