import 'dart:async';

import 'package:flutter/material.dart';

import '../app_store.dart';
import '../hero_api.dart';
import '../models.dart';
import 'battle_page.dart';
import 'deck_page.dart';
import 'hero_detail_page.dart';
import 'history_page.dart';
import 'profile_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key, required this.store});

  final AppStore store;

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final TextEditingController _searchController = TextEditingController();
  List<HeroModel> _heroes = const [];
  List<HeroModel>? _searchResults;
  bool _loading = true;
  bool _searching = false;
  String? _error;
  Timer? _debounce;

  @override
  void initState() {
    super.initState();
    _loadHeroes();
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadHeroes() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final heroes = await HeroApi.fetchRandomHeroes(count: 20);
      if (!mounted) return;
      setState(() {
        _heroes = heroes;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
      });
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  void _onSearchChanged(String value) {
    _debounce?.cancel();
    if (value.trim().isEmpty) {
      setState(() {
        _searchResults = null;
      });
      return;
    }
    _debounce = Timer(const Duration(milliseconds: 600), () async {
      setState(() {
        _searching = true;
      });
      try {
        final results = await HeroApi.searchHeroes(value.trim());
        if (!mounted) return;
        setState(() {
          _searchResults = results;
        });
      } catch (_) {
        if (!mounted) return;
        setState(() {
          _searchResults = const [];
        });
      } finally {
        if (mounted) {
          setState(() {
            _searching = false;
          });
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final store = widget.store;
    final displayHeroes = _searchResults ?? _heroes;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hero Battle'),
        actions: [
          IconButton(
            tooltip: 'Deck',
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => DeckPage(store: store)),
              );
            },
            icon: Badge(
              isLabelVisible: store.deck.isNotEmpty,
              label: Text('${store.deck.length}'),
              child: const Icon(Icons.style),
            ),
          ),
          IconButton(
            tooltip: 'History',
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => HistoryPage(store: store)),
              );
            },
            icon: const Icon(Icons.history),
          ),
          IconButton(
            tooltip: 'Profile',
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => ProfilePage(store: store)),
              );
            },
            icon: const Icon(Icons.person),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: TextField(
              controller: _searchController,
              onChanged: _onSearchChanged,
              decoration: const InputDecoration(
                prefixIcon: Icon(Icons.search),
                hintText: 'Search heroes...',
                border: OutlineInputBorder(),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    _searchResults != null
                        ? '${_searchResults!.length} results for "${_searchController.text}"'
                        : '${_heroes.length} heroes loaded',
                  ),
                ),
                if (store.deck.isNotEmpty)
                  FilledButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => BattlePage(store: store)),
                      );
                    },
                    child: const Text('Start Battle'),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: _loading || _searching
                ? const Center(child: CircularProgressIndicator())
                : _error != null
                    ? Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(_error!),
                            const SizedBox(height: 12),
                            FilledButton(
                              onPressed: _loadHeroes,
                              child: const Text('Retry'),
                            ),
                          ],
                        ),
                      )
                    : displayHeroes.isEmpty
                        ? const Center(child: Text('No heroes found.'))
                        : GridView.builder(
                            padding: const EdgeInsets.all(12),
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              childAspectRatio: 0.62,
                              crossAxisSpacing: 10,
                              mainAxisSpacing: 10,
                            ),
                            itemCount: displayHeroes.length,
                            itemBuilder: (context, index) {
                              final hero = displayHeroes[index];
                              return HeroCard(
                                hero: hero,
                                inDeck: store.containsHero(hero),
                                deckFull: store.deck.length >= AppStore.maxDeck && !store.containsHero(hero),
                                onTap: () {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (_) => HeroDetailPage(store: store, heroId: int.parse(hero.id)),
                                    ),
                                  );
                                },
                                onAdd: () => store.addHero(hero),
                                onRemove: () => store.removeHero(hero.id),
                              );
                            },
                          ),
          ),
        ],
      ),
    );
  }
}

class HeroCard extends StatelessWidget {
  const HeroCard({
    super.key,
    required this.hero,
    required this.inDeck,
    required this.deckFull,
    required this.onTap,
    required this.onAdd,
    required this.onRemove,
  });

  final HeroModel hero;
  final bool inDeck;
  final bool deckFull;
  final VoidCallback onTap;
  final VoidCallback onAdd;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: hero.imageUrl.isEmpty
                  ? const Icon(Icons.shield, size: 48)
                  : Image.network(
                      hero.imageUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (_, error, stackTrace) => const Icon(Icons.shield, size: 48),
                    ),
            ),
            Padding(
              padding: const EdgeInsets.all(8),
              child: Text(
                hero.name,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
              child: FilledButton.tonal(
                onPressed: inDeck
                    ? onRemove
                    : deckFull
                        ? null
                        : onAdd,
                child: Text(inDeck ? 'Remove' : 'Add'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
