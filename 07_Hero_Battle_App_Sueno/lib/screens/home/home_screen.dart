import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../router/app_router.dart';
import '../../providers/deck_provider.dart';
import '../../providers/player_manager_provider.dart';
import '../../providers/hero_search_provider.dart';
import '../hero_detail_screen.dart'; // ✅ ADD THIS
import '../../widgets/hero_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _savePromptShown = false;

  @override
  void initState() {
    super.initState();
    // Load all heroes on home screen load
    Future.microtask(() {
      context.read<HeroSearchProvider>().searchHeroes("");
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hero Roster'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            tooltip: 'Profile',
            onPressed: () {
              Navigator.pushNamed(context, RouteNames.profile);
            },
          ),
          IconButton(
            icon: const Icon(Icons.history),
            tooltip: 'Battle History',
            onPressed: () {
              Navigator.pushNamed(context, RouteNames.history);
            },
          ),
          IconButton(
            icon: const Icon(Icons.view_list),
            tooltip: 'Deck',
            onPressed: () {
              Navigator.pushNamed(context, RouteNames.deck);
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            /// 🧠 DECK COUNTER
            Consumer<DeckProvider>(
              builder: (_, deckProvider, _) {
                // Show save prompt when deck reaches 5 and not already shown
                if (deckProvider.deck.length == DeckProvider.maxDeckSize &&
                    !_savePromptShown) {
                  _savePromptShown = true;
                  Future.delayed(Duration.zero, () async {
                    final result = await showDialog<bool>(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: const Text('Save Deck'),
                        content: const Text('Save this team as a deck?'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context, false),
                            child: const Text('No'),
                          ),
                          ElevatedButton(
                            onPressed: () => Navigator.pop(context, true),
                            child: const Text('Yes'),
                          ),
                        ],
                      ),
                    );
                    if (result == true) {
                      // Prompt for deck name
                      final deckName = await showDialog<String>(
                        context: context,
                        builder: (context) {
                          final controller = TextEditingController();
                          return AlertDialog(
                            title: const Text('Deck Name'),
                            content: TextField(
                              controller: controller,
                              decoration: const InputDecoration(
                                labelText: 'Enter deck name',
                              ),
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: const Text('Cancel'),
                              ),
                              ElevatedButton(
                                onPressed: () => Navigator.pop(
                                  context,
                                  controller.text.trim(),
                                ),
                                child: const Text('Save'),
                              ),
                            ],
                          );
                        },
                      );
                      if (deckName != null && deckName.isNotEmpty) {
                        final player = context
                            .read<PlayerManagerProvider>()
                            .currentPlayer;
                        if (player != null) {
                          await context.read<DeckProvider>().addDeck(
                            player.id!,
                            deckName,
                            deckProvider.deck.map((h) => h.name).toList(),
                          );
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Deck "$deckName" saved!')),
                          );
                        }
                      }
                    }
                  });
                }
                if (deckProvider.deck.length < DeckProvider.maxDeckSize) {
                  _savePromptShown = false;
                }
                return Text(
                  "Selected: ${deckProvider.deck.length}/5",
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                );
              },
            ),

            const SizedBox(height: 10),

            /// 🔍 SEARCH BAR
            Consumer<HeroSearchProvider>(
              builder: (context, heroSearch, _) {
                return TextField(
                  decoration: const InputDecoration(
                    hintText: 'Search heroes...',
                    prefixIcon: Icon(Icons.search),
                    border: OutlineInputBorder(),
                  ),
                  onSubmitted: (value) async {
                    await context.read<HeroSearchProvider>().searchHeroes(
                      value,
                    );
                  },
                );
              },
            ),

            const SizedBox(height: 10),

            /// 📦 HERO GRID (with new HeroCard)
            Expanded(
              child: Consumer<HeroSearchProvider>(
                builder: (context, heroSearch, _) {
                  if (heroSearch.isLoading) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  final heroes = heroSearch.results;
                  if (heroes.isEmpty) {
                    return const Center(child: Text("No heroes found"));
                  }
                  return GridView.builder(
                    itemCount: heroes.length,
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 0.75,
                        ),
                    itemBuilder: (_, index) {
                      final hero = heroes[index];
                      return GestureDetector(
                        onTap: () async {
                          final selectedHero = await Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => HeroDetailScreen(hero: hero),
                            ),
                          );
                          if (selectedHero != null) {
                            context.read<DeckProvider>().addHero(selectedHero);
                          }
                        },
                        child: HeroCard(hero: hero),
                      );
                    },
                  );
                },
              ),
            ),

            const SizedBox(height: 10),

            /// 🎮 BOTTOM BUTTONS (Mechanics left, Start Battle right)
            Consumer<DeckProvider>(
              builder: (context, deckProvider, _) {
                return Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      ElevatedButton(
                        onPressed: () {
                          Navigator.pushNamed(context, RouteNames.mechanics);
                        },
                        child: const Text("Mechanics"),
                      ),
                      ElevatedButton(
                        onPressed:
                            deckProvider.deck.length == DeckProvider.maxDeckSize
                            ? () {
                                Navigator.pushNamed(context, RouteNames.battle);
                              }
                            : null,
                        child: const Text("Start Battle"),
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
