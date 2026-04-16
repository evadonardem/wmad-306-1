import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../models/hero_model.dart';

class HeroImage extends StatelessWidget {
  const HeroImage({
    super.key,
    required this.hero,
    this.fit = BoxFit.cover,
    this.iconSize = 56,
  });

  final HeroModel hero;
  final BoxFit fit;
  final double iconSize;

  @override
  Widget build(BuildContext context) {
    final imageUrl = _bestImageUrl(hero);

    if (imageUrl.isEmpty) {
      return _FallbackAvatar(hero: hero, iconSize: iconSize);
    }

    return CachedNetworkImage(
      imageUrl: imageUrl,
      fit: fit,
      placeholder: (context, url) =>
          const Center(child: CircularProgressIndicator()),
      errorWidget: (context, url, error) =>
          _GeneratedHeroImage(hero: hero, fit: fit, iconSize: iconSize),
    );
  }
}

String _bestImageUrl(HeroModel hero) {
  if (hero.id.isNotEmpty && hero.name.isNotEmpty) {
    final slug = hero.name
        .toLowerCase()
        .replaceAll(RegExp(r'[^a-z0-9]+'), '-')
        .replaceAll(RegExp(r'^-|-$'), '');

    if (slug.isNotEmpty) {
      return 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/${hero.id}-$slug.jpg';
    }
  }

  if (hero.imageUrl.contains('superherodb.com')) {
    return '';
  }

  return hero.imageUrl;
}

class _GeneratedHeroImage extends StatelessWidget {
  const _GeneratedHeroImage({
    required this.hero,
    required this.fit,
    required this.iconSize,
  });

  final HeroModel hero;
  final BoxFit fit;
  final double iconSize;

  @override
  Widget build(BuildContext context) {
    final seed = Uri.encodeComponent(hero.name);
    final imageUrl =
        'https://api.dicebear.com/9.x/adventurer/png?seed=$seed&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf';

    return CachedNetworkImage(
      imageUrl: imageUrl,
      fit: fit,
      placeholder: (context, url) =>
          _FallbackAvatar(hero: hero, iconSize: iconSize),
      errorWidget: (context, url, error) =>
          _FallbackAvatar(hero: hero, iconSize: iconSize),
    );
  }
}

class _FallbackAvatar extends StatelessWidget {
  const _FallbackAvatar({required this.hero, required this.iconSize});

  final HeroModel hero;
  final double iconSize;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return ColoredBox(
      color: scheme.surfaceContainerHighest,
      child: Center(
        child: Text(
          hero.name.isEmpty ? '?' : hero.name.characters.first.toUpperCase(),
          style: TextStyle(
            color: scheme.onSurfaceVariant,
            fontSize: iconSize,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
