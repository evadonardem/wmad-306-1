import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../models/hero_model.dart';

class HeroPortrait extends StatelessWidget {
  const HeroPortrait({
    super.key,
    required this.hero,
    this.fit = BoxFit.contain,
    this.padding = const EdgeInsets.all(4),
    this.borderRadius = const BorderRadius.all(Radius.circular(0)),
  });

  final HeroModel hero;
  final BoxFit fit;
  final EdgeInsets padding;
  final BorderRadius borderRadius;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final backgroundColor = isDark ? const Color(0xFF0D1626) : const Color(0xFFF2EBDD);

    return ClipRRect(
      borderRadius: borderRadius,
      child: Container(
        color: backgroundColor,
        padding: padding,
        child: CachedNetworkImage(
          imageUrl: hero.imageUrl,
          fit: fit,
          placeholder: (_, _) => Container(
            color: Colors.black12,
            alignment: Alignment.center,
            child: const CircularProgressIndicator(strokeWidth: 2),
          ),
          errorWidget: (context, error, stackTrace) => Image.network(
            hero.fallbackImageUrl,
            fit: fit,
            errorBuilder: (context, error, stackTrace) => Container(
              color: Colors.black12,
              alignment: Alignment.center,
              child: const Icon(Icons.broken_image_outlined),
            ),
          ),
        ),
      ),
    );
  }
}
