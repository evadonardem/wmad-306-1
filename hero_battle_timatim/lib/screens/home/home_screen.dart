// Home screen with simplified roster, search, and quick action cards.

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import '../../providers/hero_search_provider.dart';
import '../../router/app_router.dart';
import '../../services/superhero_api_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/hero_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final Future<List<HeroModel>> _heroesFuture;
  final _api = SuperheroApiService();
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _heroesFuture = _api.fetchRandomHeroes(count: 20);
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final restored = await context.read<HeroSearchProvider>().restore(_api);
      if (restored != null && mounted) {
        _searchController.text = restored;
      }
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _submitSearch(String q) {
    context.read<HeroSearchProvider>().setQuery(_api, q);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hero Roster'),
        actions: [
          Consumer<DeckProvider>(
            builder: (context, deck, _) => Stack(
              alignment: Alignment.center,
              children: [
                IconButton(
                  icon: const Icon(Icons.style),
                  onPressed: () => Navigator.pushNamed(
                    context,
                    RouteNames.deckBuilder,
                  ),
                ),
                if (deck.deckSize > 0)
                  Positioned(
                    right: 10,
                    top: 10,
                    child: CircleAvatar(
                      radius: 9,
                      backgroundColor: AppColors.primary,
                      child: Text(
                        '${deck.deckSize}',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.person_outline),
            onPressed: () => Navigator.pushNamed(context, RouteNames.profile),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.medium),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.medium),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Pick your champion',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: AppSpacing.small),
                      Text(
                        'Browse heroes, build your deck, and start battles quickly.',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      const SizedBox(height: AppSpacing.medium),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () => Navigator.pushNamed(context, RouteNames.history),
                              icon: const Icon(Icons.history, size: 18),
                              label: const Text('History'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppColors.textHigh,
                                side: BorderSide(color: AppColors.border),
                                padding: const EdgeInsets.symmetric(vertical: 14),
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () => Navigator.pushNamed(context, RouteNames.savedDecks),
                              icon: const Icon(Icons.bookmark_border, size: 18),
                              label: const Text('Saved'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppColors.textHigh,
                                side: BorderSide(color: AppColors.border),
                                padding: const EdgeInsets.symmetric(vertical: 14),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.medium),
              TextField(
                controller: _searchController,
                textInputAction: TextInputAction.search,
                onSubmitted: _submitSearch,
                decoration: InputDecoration(
                  hintText: 'Search hero by name',
                  prefixIcon: const Icon(Icons.search),
                  suffixIcon: IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () {
                      _searchController.clear();
                      context.read<HeroSearchProvider>().clear();
                    },
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.medium),
              Expanded(child: _buildBody()),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBody() {
    return Consumer<HeroSearchProvider>(
      builder: (context, search, _) {
        if (search.hasQuery) {
          if (search.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (search.error != null) {
            return _ErrorBlock(message: search.error!);
          }
          if (search.results.isEmpty) {
            return const _EmptyState(
              title: 'No heroes found',
              subtitle: 'Try a different name or clear the search.',
            );
          }
          return _grid(search.results);
        }

        return FutureBuilder<List<HeroModel>>(
          future: _heroesFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState != ConnectionState.done) {
              return const Center(child: CircularProgressIndicator());
            }
            if (snapshot.hasError) {
              return _ErrorBlock(message: '${snapshot.error}');
            }
            return _grid(snapshot.data!);
          },
        );
      },
    );
  }

  Widget _grid(List<HeroModel> heroes) => GridView.builder(
        padding: EdgeInsets.zero,
        itemCount: heroes.length,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.62,
          crossAxisSpacing: AppSpacing.small,
          mainAxisSpacing: AppSpacing.small,
        ),
        itemBuilder: (context, i) => HeroCard(hero: heroes[i]),
      );
}

class _ErrorBlock extends StatelessWidget {
  final String message;
  const _ErrorBlock({required this.message});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.large),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.error_outline, size: 48, color: AppColors.danger),
            const SizedBox(height: AppSpacing.medium),
            Text(
              'Could not load heroes',
              style: Theme.of(context).textTheme.titleLarge,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.small),
            Text(
              message,
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final String title;
  final String subtitle;
  const _EmptyState({required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.large),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.sentiment_dissatisfied,
                size: 56, color: AppColors.textMedium),
            const SizedBox(height: AppSpacing.medium),
            Text(
              title,
              style: Theme.of(context).textTheme.titleLarge,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.small),
            Text(
              subtitle,
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
