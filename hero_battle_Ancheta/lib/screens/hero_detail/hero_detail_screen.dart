import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/foundation.dart';
import '../../../models/hero_model.dart';
import '../../../providers/deck_provider.dart';
import '../../../widgets/stat_row.dart';
import '../../../widgets/hp_bar.dart';

class HeroDetailScreen extends StatelessWidget {
  final HeroModel hero;
  final String? initialImageUrl;

  const HeroDetailScreen({
    super.key,
    required this.hero,
    this.initialImageUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(hero.name),
        actions: [
          Consumer<DeckProvider>(
            builder: (context, deck, _) {
              final inDeck = deck.contains(hero);
              return IconButton(
                icon: Icon(inDeck ? Icons.remove : Icons.add),
                onPressed: deck.isFull && !inDeck
                    ? null
                    : () {
                        if (inDeck) {
                          deck.removeHero(hero);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Removed from deck'),
                              duration: Duration(seconds: 1),
                            ),
                          );
                        } else {
                          deck.addHero(hero);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Added to deck'),
                              duration: Duration(seconds: 1),
                            ),
                          );
                        }
                      },
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ✅ Hero image with full fallback chain
            Center(
              child: Hero(
                tag: 'hero_${hero.id}',
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: _DetailHeroImage(
                    hero: hero,
                    initialImageUrl: initialImageUrl,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Hero Info Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      hero.name,
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Chip(
                          label: Text(hero.alignment.toUpperCase()),
                          backgroundColor: _getAlignmentColor(),
                          labelStyle: const TextStyle(color: Colors.white),
                        ),
                        const SizedBox(width: 8),
                        Chip(
                          label: Text(hero.publisher),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    if (hero.fullName.isNotEmpty)
                      Text(
                        'Real Name: ${hero.fullName}',
                        style: TextStyle(color: Colors.grey[600]),
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Battle Stats Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Battle Stats',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    HpBar(
                      currentHp: hero.maxHp,
                      maxHp: hero.maxHp,
                      heroName: hero.name,
                    ),
                    const SizedBox(height: 16),
                    StatRow(
                      label: 'Attack',
                      value: hero.attack,
                      icon: Icons.flash_on,
                      color: Colors.orange,
                    ),
                    const SizedBox(height: 8),
                    StatRow(
                      label: 'Defense',
                      value: hero.defense,
                      icon: Icons.shield,
                      color: Colors.blue,
                    ),
                    const SizedBox(height: 8),
                    StatRow(
                      label: 'Special Attack',
                      value: hero.specialAttack,
                      icon: Icons.star,
                      color: Colors.teal,
                    ),
                    const SizedBox(height: 8),
                    StatRow(
                      label: 'Initiative',
                      value: hero.initiative,
                      icon: Icons.speed,
                      color: Colors.teal,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Power Stats Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Power Stats',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    StatRow(
                      label: 'Intelligence',
                      value: hero.powerStats.intelligence,
                      icon: Icons.psychology,
                    ),
                    const SizedBox(height: 8),
                    StatRow(
                      label: 'Strength',
                      value: hero.powerStats.strength,
                      icon: Icons.fitness_center,
                    ),
                    const SizedBox(height: 8),
                    StatRow(
                      label: 'Speed',
                      value: hero.powerStats.speed,
                      icon: Icons.directions_run,
                    ),
                    const SizedBox(height: 8),
                    StatRow(
                      label: 'Durability',
                      value: hero.powerStats.durability,
                      icon: Icons.safety_check,
                    ),
                    const SizedBox(height: 8),
                    StatRow(
                      label: 'Power',
                      value: hero.powerStats.power,
                      icon: Icons.bolt,
                    ),
                    const SizedBox(height: 8),
                    StatRow(
                      label: 'Combat',
                      value: hero.powerStats.combat,
                      icon: Icons.sports_mma,
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

  Color _getAlignmentColor() {
    switch (hero.alignment.toLowerCase()) {
      case 'good':
        return Colors.blue;
      case 'bad':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}

/// ✅ Stateful widget that walks through the image URL fallback chain for the
/// detail view (larger 250px image).
/// Chain: imageUrl → cdnImageUrl → fallbackImageUrl → icon placeholder
class _DetailHeroImage extends StatefulWidget {
  final HeroModel hero;
  final String? initialImageUrl;

  const _DetailHeroImage({
    required this.hero,
    this.initialImageUrl,
  });

  @override
  State<_DetailHeroImage> createState() => _DetailHeroImageState();
}

class _DetailHeroImageState extends State<_DetailHeroImage> {
  static const Alignment _faceAlignment = Alignment(0, -0.28);
  late List<String> _urlQueue;
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _urlQueue = _buildUrlQueue();
    _currentIndex = 0;
  }

  List<String> _buildUrlQueue() {
    final candidates = <String>[];

    void addIfValid(String? url) {
      if (url == null) return;
      final trimmed = url.trim();
      if (trimmed.isNotEmpty && !candidates.contains(trimmed)) {
        candidates.add(trimmed);
      }
    }

    addIfValid(widget.initialImageUrl);
    for (final url in widget.hero.imageUrlCandidates) {
      addIfValid(url);
    }

    return candidates;
  }

  void _tryNext() {
    if (_currentIndex < _urlQueue.length - 1) {
      setState(() => _currentIndex++);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_urlQueue.isEmpty) return _placeholder(context);

    if (kIsWeb) {
      return Image.network(
        _urlQueue[_currentIndex],
        height: 250,
        width: double.infinity,
        fit: BoxFit.cover,
        alignment: _faceAlignment,
        filterQuality: FilterQuality.high,
        loadingBuilder: (context, child, progress) {
          if (progress == null) return child;
          return Container(
            height: 250,
            color: Colors.grey[800],
            child: const Center(child: CircularProgressIndicator()),
          );
        },
        errorBuilder: (context, error, stackTrace) {
          WidgetsBinding.instance.addPostFrameCallback((_) => _tryNext());
          return _placeholder(context);
        },
      );
    }

    return CachedNetworkImage(
      imageUrl: _urlQueue[_currentIndex],
      height: 250,
      width: double.infinity,
      fit: BoxFit.cover,
      alignment: _faceAlignment,
      filterQuality: FilterQuality.high,
      cacheKey: '${widget.hero.id}_detail_$_currentIndex',
      placeholder: (context, url) => Container(
        height: 250,
        color: Colors.grey[800],
        child: const Center(child: CircularProgressIndicator()),
      ),
      errorWidget: (context, url, error) {
        WidgetsBinding.instance.addPostFrameCallback((_) => _tryNext());
        return _placeholder(context);
      },
    );
  }

  Widget _placeholder(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF162033) : const Color(0xFFEAF2FF);
    final iconColor = isDark ? const Color(0xFF8CB8FF) : const Color(0xFF1D4ED8);
    final textColor = isDark ? const Color(0xFFD6E4FF) : const Color(0xFF1E3A8A);
    final badgeBg = isDark ? const Color(0xFF1E3A5F) : const Color(0xFFD8E9FF);

    return Container(
      height: 250,
      color: bg,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.person,
            size: 80,
            color: iconColor,
          ),
          const SizedBox(height: 16),
          Text(
            widget.hero.name,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: textColor,
            ),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: badgeBg,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: _alignmentColor(widget.hero.alignment)),
            ),
            child: Text(
              widget.hero.alignment.toUpperCase(),
              style: TextStyle(fontSize: 12, color: textColor),
            ),
          ),
        ],
      ),
    );
  }

  Color _alignmentColor(String alignment) {
    switch (alignment.toLowerCase()) {
      case 'good':
        return Colors.blue;
      case 'bad':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}