// Hero card for the roster screen with a clean, elevated layout.

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';

import '../models/hero_model.dart';
import '../providers/deck_provider.dart';
import '../router/app_router.dart';
import '../theme/app_theme.dart';

class HeroCard extends StatefulWidget {
  final HeroModel hero;
  const HeroCard({super.key, required this.hero});

  @override
  State<HeroCard> createState() => _HeroCardState();
}

class _HeroCardState extends State<HeroCard> {
  final GlobalKey _imgKey = GlobalKey();
  bool _pressed = false;

  void _flyToDeck() {
    final ctx = _imgKey.currentContext;
    final overlay = Overlay.maybeOf(context);
    if (ctx == null || overlay == null) return;
    final box = ctx.findRenderObject() as RenderBox?;
    if (box == null) return;

    final start = box.localToGlobal(Offset.zero);
    final size = box.size;
    final screen = MediaQuery.of(context).size;
    final end = Offset(screen.width - 42, 42);

    late OverlayEntry entry;
    entry = OverlayEntry(
      builder: (_) => _FlyingHero(
        imageUrl: widget.hero.imageUrl,
        start: start,
        end: end,
        startSize: size,
        onDone: () => entry.remove(),
      ),
    );
    overlay.insert(entry);
  }

  @override
  Widget build(BuildContext context) {
    final hero = widget.hero;
    final top3 = hero.powerStats.sortedEntries().take(3).toList();

    return AnimatedContainer(
      duration: const Duration(milliseconds: 180),
      curve: Curves.easeOut,
      margin: const EdgeInsets.all(AppSpacing.small),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(AppSpacing.radius),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(_pressed ? 0.12 : 0.06),
            blurRadius: _pressed ? 14 : 10,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radius),
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(AppSpacing.radius),
          onTap: () => Navigator.pushNamed(
            context,
            RouteNames.heroDetail,
            arguments: hero,
          ),
          onTapDown: (_) => setState(() => _pressed = true),
          onTapCancel: () => setState(() => _pressed = false),
          onTapUp: (_) => setState(() => _pressed = false),
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.medium),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Expanded(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      key: _imgKey,
                      color: AppColors.surfaceSoft,
                      child: CachedNetworkImage(
                        imageUrl: hero.imageUrl,
                        fit: BoxFit.cover,
                        placeholder: (_, __) => const Center(
                          child: CircularProgressIndicator(),
                        ),
                        errorWidget: (_, __, ___) => const Icon(
                          Icons.broken_image,
                          size: 42,
                          color: AppColors.textMedium,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.medium),
                Text(
                  hero.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 4),
                Text(
                  hero.publisher,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                const SizedBox(height: AppSpacing.small),
                Wrap(
                  spacing: 8,
                  runSpacing: 6,
                  children: top3
                      .map(
                        (entry) => Chip(
                          label: Text('${entry.key}: ${entry.value}'),
                          visualDensity: VisualDensity.compact,
                          backgroundColor: AppColors.surfaceSoft,
                          labelStyle: const TextStyle(
                            color: AppColors.textHigh,
                            fontSize: 12,
                          ),
                        ),
                      )
                      .toList(),
                ),
                const SizedBox(height: AppSpacing.small),
                Consumer<DeckProvider>(
                  builder: (context, deck, _) {
                    final inDeck = deck.contains(hero);
                    final disabled = !inDeck && deck.isFull;
                    return SizedBox(
                      height: 36,
                      child: ElevatedButton.icon(
                        onPressed: disabled
                            ? null
                            : () {
                                if (inDeck) {
                                  deck.removeHero(hero);
                                } else {
                                  _flyToDeck();
                                  deck.addHero(hero);
                                }
                              },
                        icon: Icon(inDeck ? Icons.remove : Icons.add),
                        label: Text(inDeck ? 'Remove' : 'Add'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: inDeck
                              ? AppColors.danger
                              : AppColors.primary,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _FlyingHero extends StatelessWidget {
  final String imageUrl;
  final Offset start;
  final Offset end;
  final Size startSize;
  final VoidCallback onDone;

  const _FlyingHero({
    required this.imageUrl,
    required this.start,
    required this.end,
    required this.startSize,
    required this.onDone,
  });

  @override
  Widget build(BuildContext context) {
    final dx = end.dx - start.dx;
    final dy = end.dy - start.dy;

    final flying = Container(
      width: startSize.width,
      height: startSize.height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.primary.withOpacity(0.6), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.18),
            blurRadius: 18,
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: CachedNetworkImage(
        imageUrl: imageUrl,
        fit: BoxFit.cover,
        errorWidget: (_, __, ___) => const Icon(
          Icons.bolt,
          color: AppColors.primary,
        ),
      ),
    )
        .animate(onComplete: (_) => onDone())
        .move(
          duration: 550.ms,
          curve: Curves.easeInOut,
          end: Offset(dx, dy),
        )
        .scaleXY(end: 0.20, duration: 550.ms, curve: Curves.easeInOut)
        .fadeOut(delay: 350.ms, duration: 180.ms);

    return Positioned(
      left: start.dx,
      top: start.dy,
      child: IgnorePointer(child: flying),
    );
  }
}
