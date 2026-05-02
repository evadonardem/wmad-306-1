import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:palette_generator/palette_generator.dart';

import '../models/hero_model.dart';

class HeroCard extends StatefulWidget {
  const HeroCard({super.key, required this.hero, this.onTap});

  final HeroModel hero;
  final VoidCallback? onTap;

  @override
  State<HeroCard> createState() => _HeroCardState();
}

class _HeroCardState extends State<HeroCard> {
  static const Color _fallbackNeon = Color(0xFF35D9FF);
  static final Map<String, Color> _neonCache = <String, Color>{};

  Color _neonColor = _fallbackNeon;

  @override
  void initState() {
    super.initState();
    _setCachedColorOrDefault();
    _resolveNeonColor();
  }

  @override
  void didUpdateWidget(covariant HeroCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.hero.imageUrl != widget.hero.imageUrl) {
      _setCachedColorOrDefault();
      _resolveNeonColor();
    }
  }

  void _setCachedColorOrDefault() {
    _neonColor = _neonCache[widget.hero.imageUrl] ?? _fallbackNeon;
  }

  Future<void> _resolveNeonColor() async {
    final imageUrl = widget.hero.imageUrl;
    if (imageUrl.isEmpty) {
      return;
    }

    if (_neonCache.containsKey(imageUrl)) {
      return;
    }

    try {
      final palette = await PaletteGenerator.fromImageProvider(
        CachedNetworkImageProvider(imageUrl),
        size: const Size(96, 144),
        maximumColorCount: 10,
      );

      final resolved = _bestNeonFromPalette(palette) ?? _fallbackNeon;
      _neonCache[imageUrl] = resolved;

      if (!mounted) return;
      setState(() {
        _neonColor = resolved;
      });
    } catch (_) {
      _neonCache[imageUrl] = _fallbackNeon;
    }
  }

  Color? _bestNeonFromPalette(PaletteGenerator palette) {
    final colors = <Color?>[
      palette.vibrantColor?.color,
      palette.lightVibrantColor?.color,
      palette.dominantColor?.color,
      palette.mutedColor?.color,
    ];

    for (final color in colors) {
      if (color == null) continue;

      final hsl = HSLColor.fromColor(color);
      return hsl
          .withSaturation((hsl.saturation + 0.32).clamp(0.58, 1.0).toDouble())
          .withLightness((hsl.lightness + 0.16).clamp(0.45, 0.72).toDouble())
          .toColor();
    }

    return null;
  }

  Color _shiftHue(Color color, double degrees) {
    final hsl = HSLColor.fromColor(color);
    final newHue = (hsl.hue + degrees) % 360;
    return hsl.withHue(newHue).toColor();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final neonSecondary = _shiftHue(_neonColor, 24);

    return AnimatedContainer(
      duration: const Duration(milliseconds: 420),
      curve: Curves.easeOutCubic,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: <Color>[
            _neonColor.withValues(alpha: 0.92),
            neonSecondary.withValues(alpha: 0.86),
          ],
        ),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: _neonColor.withValues(alpha: 0.42),
            blurRadius: 24,
            spreadRadius: 1.4,
          ),
          BoxShadow(
            color: neonSecondary.withValues(alpha: 0.22),
            blurRadius: 36,
            spreadRadius: 0.5,
          ),
        ],
      ),
      padding: const EdgeInsets.all(1.8),
      child: Material(
        color: theme.colorScheme.surface.withValues(alpha: 0.93),
        borderRadius: BorderRadius.circular(18),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: widget.onTap,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Expanded(
                child: Stack(
                  fit: StackFit.expand,
                  children: <Widget>[
                    CachedNetworkImage(
                      imageUrl: widget.hero.imageUrl,
                      fit: BoxFit.cover,
                      placeholder: (context, imageUrl) => const ColoredBox(
                        color: Color(0xFF0E1A2D),
                        child: Center(child: CircularProgressIndicator()),
                      ),
                      errorWidget: (context, imageUrl, error) =>
                          const ColoredBox(
                            color: Color(0xFF0E1A2D),
                            child: Icon(Icons.image_not_supported_outlined),
                          ),
                    ),
                    DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: <Color>[
                            Colors.transparent,
                            Colors.black.withValues(alpha: 0.12),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.fromLTRB(10, 8, 10, 10),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: <Color>[
                      theme.colorScheme.surface.withValues(alpha: 0.98),
                      theme.colorScheme.surfaceContainerHigh.withValues(
                        alpha: 0.9,
                      ),
                    ],
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      widget.hero.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.1,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      widget.hero.publisher,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.bodySmall?.copyWith(
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.85,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: <Widget>[
                        Icon(Icons.flash_on, size: 14, color: _neonColor),
                        const SizedBox(width: 4),
                        Text(
                          'ATK ${widget.hero.attackPower}',
                          style: theme.textTheme.bodySmall?.copyWith(
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.8,
                          ),
                        ),
                        const Spacer(),
                        Icon(Icons.favorite, size: 14, color: neonSecondary),
                        const SizedBox(width: 4),
                        Text(
                          'HP ${widget.hero.baseHp}',
                          style: theme.textTheme.bodySmall?.copyWith(
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.8,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
