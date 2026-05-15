import 'package:flutter/material.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:provider/provider.dart';

import '../providers/dogs_provider.dart';
import '../providers/favorites_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/dog_card.dart';
import 'dog_detail_screen.dart';

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final dogs = context.watch<DogsProvider>();
    final favs = context.watch<FavoritesProvider>();

    final liked = dogs.all
        .where((d) => favs.isFavorite(d.id))
        .toList(growable: false);

    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Favorites',
                      style: Theme.of(context)
                          .textTheme
                          .headlineMedium
                          ?.copyWith(fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      liked.isEmpty
                          ? 'Tap the heart on a card to save it here.'
                          : '${liked.length} saved',
                      style: const TextStyle(color: AppColors.inkSoft),
                    ),
                  ],
                ),
              ),
            ),
            if (liked.isEmpty)
              const SliverFillRemaining(
                hasScrollBody: false,
                child: _EmptyHearts(),
              )
            else
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
                sliver: SliverGrid(
                  gridDelegate:
                      const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: 14,
                    crossAxisSpacing: 14,
                    childAspectRatio: 0.78,
                  ),
                  delegate: SliverChildBuilderDelegate(
                    childCount: liked.length,
                    (context, i) {
                      final dog = liked[i];
                      return AnimationConfiguration.staggeredGrid(
                        position: i,
                        columnCount: 2,
                        duration: const Duration(milliseconds: 380),
                        child: ScaleAnimation(
                          scale: 0.92,
                          child: FadeInAnimation(
                            child: DogCard(
                              key: ValueKey(dog.id),
                              dog: dog,
                              isFavorite: true,
                              onToggleFavorite: () => favs.toggle(dog.id),
                              onTap: () => Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (_) => DogDetailScreen(
                                    id: dog.id,
                                    summary: dog,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _EmptyHearts extends StatelessWidget {
  const _EmptyHearts();
  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.all(32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.favorite_border, size: 56, color: AppColors.inkSoft),
          SizedBox(height: 12),
          Text(
            'Nothing saved yet',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18),
          ),
          SizedBox(height: 4),
          Text(
            'Tap the heart on a dog to save it here.',
            style: TextStyle(color: AppColors.inkSoft),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
