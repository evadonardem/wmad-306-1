import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/hero_model.dart';
import '../providers/deck_provider.dart';
import '../router/app_router.dart';

class HeroCard extends StatelessWidget {
  final HeroModel hero;
  const HeroCard({super.key, required this.hero});

  Color get _alignmentColor => hero.alignment == 'good'
      ? const Color(0xFF4ADE80)
      : hero.alignment == 'bad'
          ? const Color(0xFFF87171)
          : const Color(0xFFFBBF24);

  Color get _alignmentBg => hero.alignment == 'good'
      ? const Color(0xFF0F2D1F)
      : hero.alignment == 'bad'
          ? const Color(0xFF2D0F0F)
          : const Color(0xFF2D1F00);

  List<Color> get _heroGradient {
    final hue = (hero.id.hashCode % 360).abs().toDouble();
    return [
      HSLColor.fromAHSL(1, hue, 0.6, 0.25).toColor(),
      HSLColor.fromAHSL(1, (hue + 40) % 360, 0.5, 0.15).toColor(),
    ];
  }

  String get _heroEmoji {
    if (hero.alignment == 'bad') return '💀';
    final pub = hero.publisher.toLowerCase();
    if (pub.contains('marvel')) return '⚡';
    if (pub.contains('dc')) return '🦸';
    return '✨';
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () =>
          Navigator.pushNamed(context, RouteNames.heroDetail, arguments: hero),
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF1A1A2E),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFF2A2A3E), width: 0.5),
        ),
        clipBehavior: Clip.hardEdge,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                Container(
                  height: 120,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: _heroGradient,
                    ),
                  ),
                  child: Stack(
                    children: [
                      Positioned(
                        right: -20, top: -20,
                        child: Container(
                          width: 90, height: 90,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.white.withOpacity(0.05),
                          ),
                        ),
                      ),
                      Positioned(
                        left: -10, bottom: -10,
                        child: Container(
                          width: 60, height: 60,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.white.withOpacity(0.04),
                          ),
                        ),
                      ),
                      Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              width: 56, height: 56,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white.withOpacity(0.12),
                                border: Border.all(
                                  color: Colors.white.withOpacity(0.2),
                                  width: 1.5,
                                ),
                              ),
                              child: Center(
                                child: Text(
                                  hero.name.isNotEmpty
                                      ? hero.name[0].toUpperCase()
                                      : '?',
                                  style: const TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(_heroEmoji, style: const TextStyle(fontSize: 14)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                Positioned(
                  bottom: 0, left: 0, right: 0,
                  child: Container(
                    height: 30,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.bottomCenter,
                        end: Alignment.topCenter,
                        colors: [const Color(0xFF1A1A2E), Colors.transparent],
                      ),
                    ),
                  ),
                ),
                Positioned(
                  top: 6, right: 6,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                    decoration: BoxDecoration(
                        color: _alignmentBg,
                        borderRadius: BorderRadius.circular(8)),
                    child: Text(
                      hero.alignment == 'good'
                          ? 'Good'
                          : hero.alignment == 'bad'
                              ? 'Bad'
                              : 'Neutral',
                      style: TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w600,
                          color: _alignmentColor),
                    ),
                  ),
                ),
                Consumer<DeckProvider>(
                  builder: (_, deck, __) => deck.contains(hero)
                      ? Positioned(
                          top: 6, left: 6,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 6, vertical: 3),
                            decoration: BoxDecoration(
                              color: const Color(0xFF7B2FBE).withOpacity(0.9),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Text('In Deck',
                                style: TextStyle(
                                    fontSize: 9,
                                    color: Colors.white,
                                    fontWeight: FontWeight.w600)),
                          ),
                        )
                      : const SizedBox.shrink(),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    hero.name,
                    style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFFE2D9F3)),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    (hero.publisher.isNotEmpty && hero.publisher != 'null')
                        ? hero.publisher
                        : 'Unknown',
                    style:
                        const TextStyle(fontSize: 10, color: Color(0xFF666666)),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Container(
                        width: 5, height: 5,
                        decoration: const BoxDecoration(
                            color: Color(0xFFA855F7), shape: BoxShape.circle),
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(2),
                          child: LinearProgressIndicator(
                            value: (hero.attack / 100).clamp(0.0, 1.0),
                            backgroundColor: const Color(0xFF2A2A3E),
                            color: const Color(0xFFA855F7),
                            minHeight: 4,
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text('${hero.attack}',
                          style: const TextStyle(
                              fontSize: 10, color: Color(0xFF888888))),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
