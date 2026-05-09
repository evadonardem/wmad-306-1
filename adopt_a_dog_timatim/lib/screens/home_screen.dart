import 'package:flutter/material.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:provider/provider.dart';

import '../providers/dogs_provider.dart';
import '../providers/favorites_provider.dart';
import '../widgets/dog_card.dart';
import '../widgets/filter_pill.dart';
import 'dog_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _searchCtrl = TextEditingController();
  final _scrollCtrl = ScrollController();

  @override
  void dispose() {
    _searchCtrl.dispose();
    _scrollCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final dogs = context.watch<DogsProvider>();
    final favs = context.watch<FavoritesProvider>();
    final colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          color: colorScheme.primary,
          onRefresh: () => dogs.load(refresh: true),
          child: CustomScrollView(
            controller: _scrollCtrl,
            slivers: [
              SliverAppBar(
                expandedHeight: 200,
                pinned: true,
                backgroundColor: colorScheme.surface,
                elevation: 0,
                scrolledUnderElevation: 0,
                flexibleSpace: FlexibleSpaceBar(
                  background: _headerBackground(context, dogs),
                  titlePadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                  title: const Text('Dog adopter'),
                  centerTitle: false,
                ),
              ),
              SliverToBoxAdapter(child: _searchBar(context, dogs)),
              SliverToBoxAdapter(child: _filters(context, dogs)),
              _grid(context, dogs, favs),
              const SliverToBoxAdapter(child: SizedBox(height: 28)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _headerBackground(BuildContext context, DogsProvider dogs) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            colorScheme.primaryContainer.withOpacity(0.5),
            colorScheme.surface,
          ],
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 8),
            Text(
              'Find your forever friend.',
              style: textTheme.displaySmall?.copyWith(
                fontWeight: FontWeight.w600,
                height: 1.1,
                color: colorScheme.onSurface,
              ),
            ),
            Text(
              'Browse and adopt the perfect dog',
              style: textTheme.bodyLarge?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _searchBar(BuildContext context, DogsProvider dogs) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: ValueListenableBuilder(
        valueListenable: _searchCtrl,
        builder: (context, value, _) {
          return TextField(
            controller: _searchCtrl,
            onChanged: dogs.setQuery,
            decoration: InputDecoration(
              hintText: 'Search by name or breed',
              prefixIcon: const Icon(Icons.search),
              suffixIcon: _searchCtrl.text.isEmpty
                  ? null
                  : IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () {
                        _searchCtrl.clear();
                        dogs.setQuery('');
                      },
                    ),
            ),
          );
        },
      ),
    );
  }

  Widget _filters(BuildContext context, DogsProvider dogs) {
    if (dogs.filters.isEmpty) return const SizedBox(height: 8);
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Padding(
      padding: const EdgeInsets.only(top: 8, bottom: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
            child: Row(
              children: [
                Text(
                  'Perfect Match',
                  style: textTheme.labelLarge?.copyWith(
                    color: colorScheme.onSurfaceVariant,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const Spacer(),
                if (dogs.activeFilters.isNotEmpty)
                  TextButton(
                    onPressed: dogs.clearFilters,
                    child: const Text('Clear'),
                  ),
              ],
            ),
          ),
          SizedBox(
            height: 40,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              scrollDirection: Axis.horizontal,
              itemCount: dogs.filters.length,
              separatorBuilder: (_, _) => const SizedBox(width: 8),
              itemBuilder: (context, i) {
                final f = dogs.filters[i];
                return FilterPill(
                  label: f,
                  active: dogs.activeFilters.contains(f),
                  onTap: () => dogs.toggleFilter(f),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _grid(BuildContext context, DogsProvider dogs, FavoritesProvider favs) {
    final colorScheme = Theme.of(context).colorScheme;

    if (dogs.state == LoadState.loading && dogs.all.isEmpty) {
      return SliverFillRemaining(
        hasScrollBody: false,
        child: Center(
          child: CircularProgressIndicator(color: colorScheme.primary),
        ),
      );
    }
    if (dogs.state == LoadState.error && dogs.all.isEmpty) {
      return SliverFillRemaining(
        hasScrollBody: false,
        child: _errorState(context, dogs),
      );
    }

    final list = dogs.visible;
    if (list.isEmpty) {
      return const SliverFillRemaining(
        hasScrollBody: false,
        child: _EmptyState(),
      );
    }

    final width = MediaQuery.of(context).size.width;
    final cols = width >= 720 ? 3 : 2;

    return SliverPadding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
      sliver: SliverGrid(
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: cols,
          mainAxisSpacing: 16,
          crossAxisSpacing: 16,
          childAspectRatio: 0.78,
        ),
        delegate: SliverChildBuilderDelegate(
          childCount: list.length,
          (context, i) {
            final dog = list[i];
            // The "Perfect Match" rearrangement: cards animate in/out as the
            // filter set changes, since `visible` shrinks/grows.
            return AnimationConfiguration.staggeredGrid(
              position: i,
              columnCount: cols,
              duration: const Duration(milliseconds: 420),
              child: ScaleAnimation(
                scale: 0.92,
                child: FadeInAnimation(
                  child: DogCard(
                    key: ValueKey(dog.id),
                    dog: dog,
                    isFavorite: favs.isFavorite(dog.id),
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
    );
  }

  Widget _errorState(BuildContext context, DogsProvider dogs) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.cloud_off, size: 48, color: colorScheme.outline),
          const SizedBox(height: 16),
          Text(
            "Couldn't load dogs",
            style: textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.w600,
              color: colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            dogs.error ?? 'Please check your connection.',
            textAlign: TextAlign.center,
            style: textTheme.bodyMedium?.copyWith(
              color: colorScheme.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: 24),
          FilledButton(
            onPressed: () => dogs.load(refresh: true),
            child: const Text('Try again'),
          ),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.search_off, size: 48, color: colorScheme.outline),
          const SizedBox(height: 16),
          Text(
            'No matches yet',
            style: textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.w600,
              color: colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Try a different filter or search term.',
            textAlign: TextAlign.center,
            style: textTheme.bodyMedium?.copyWith(
              color: colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }
}
