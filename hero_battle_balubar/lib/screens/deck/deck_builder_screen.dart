import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:hero_battle/models/hero_model.dart';
import 'package:hero_battle/providers/deck_provider.dart';
import 'package:hero_battle/providers/hero_search_provider.dart';
import 'package:hero_battle/providers/player_provider.dart';
import 'package:hero_battle/widgets/hero_card.dart';
import 'package:hero_battle/widgets/hero_image_widget.dart';
import 'package:hero_battle/router/app_router.dart';

class DeckBuilderScreen extends StatefulWidget {
  const DeckBuilderScreen({super.key});

  @override
  State<DeckBuilderScreen> createState() => _DeckBuilderScreenState();
}

class _DeckBuilderScreenState extends State<DeckBuilderScreen> {
  // null = show deck list, non-null = editing/creating
  String? _editingDeckId; // 'new' for new deck, or existing deck id
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _deckNameController = TextEditingController();
  final List<HeroModel> _selectedHeroes = [];

  @override
  void dispose() {
    _searchController.dispose();
    _deckNameController.dispose();
    super.dispose();
  }

  void _startNewDeck() {
    _editingDeckId = 'new';
    _deckNameController.text = 'My Deck';
    _selectedHeroes.clear();
    setState(() {});
    _loadHeroesForPicker();
  }

  void _startEditDeck(Deck deck) {
    _editingDeckId = deck.id;
    _deckNameController.text = deck.name;
    _selectedHeroes.clear();
    _selectedHeroes.addAll(deck.heroes);
    setState(() {});
    _loadHeroesForPicker();
  }

  void _loadHeroesForPicker() {
    context.read<HeroSearchProvider>().getRandomHeroes(count: 8);
  }

  void _backToList() {
    setState(() {
      _editingDeckId = null;
      _searchController.clear();
    });
  }

  void _toggleHero(HeroModel hero) {
    setState(() {
      final index = _selectedHeroes.indexWhere((h) => h.id == hero.id);
      if (index >= 0) {
        _selectedHeroes.removeAt(index);
      } else if (_selectedHeroes.length < 5) {
        _selectedHeroes.add(hero);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Max 5 heroes per deck!'),
            backgroundColor: Colors.red,
          ),
        );
      }
    });
  }

  void _saveDeck() {
    if (_selectedHeroes.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Select at least 1 hero for your deck'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final name = _deckNameController.text.trim().isEmpty
        ? 'My Deck'
        : _deckNameController.text.trim();

    final deckProvider = context.read<DeckProvider>();

    if (_editingDeckId == 'new') {
      deckProvider.createDeck(name, List.from(_selectedHeroes));
    } else {
      deckProvider.updateDeck(
          _editingDeckId!, name, List.from(_selectedHeroes));
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('"$name" saved with ${_selectedHeroes.length} heroes!'),
        backgroundColor: Colors.green,
      ),
    );

    _backToList();
  }

  void _saveDeckToDb() {
    if (_selectedHeroes.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Select at least 1 hero for your deck'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final nameController = TextEditingController(
      text: _deckNameController.text.trim().isEmpty
          ? 'My Deck'
          : _deckNameController.text.trim(),
    );

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Theme.of(context).cardTheme.color,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.cloud_upload, color: Colors.amber, size: 24),
            SizedBox(width: 8),
            Text('Save Deck'),
          ],
        ),
        content: TextField(
          controller: nameController,
          autofocus: true,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: 'Enter deck name',
            hintStyle: TextStyle(color: Colors.grey[500]),
            enabledBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: Colors.grey[600]!),
            ),
            focusedBorder: const UnderlineInputBorder(
              borderSide: BorderSide(color: Colors.amber),
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child:
                const Text('Cancel', style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            onPressed: () async {
              final name = nameController.text.trim().isEmpty
                  ? 'My Deck'
                  : nameController.text.trim();
              Navigator.pop(ctx);
              final deckProvider = context.read<DeckProvider>();
              await deckProvider.saveDeckToDb(
                  name, List.from(_selectedHeroes));
              if (!mounted) return;
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                      '"$name" saved to database with ${_selectedHeroes.length} heroes!'),
                  backgroundColor: Colors.green,
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.amber),
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_editingDeckId != null) {
      return _buildEditorView();
    }
    return _buildDeckListView();
  }

  // ── Deck list view ───────────────────────────────────────────────────

  Widget _buildDeckListView() {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Decks'),
        actions: [
          TextButton.icon(
            onPressed: () =>
                Navigator.pushNamed(context, RouteNames.savedDecks),
            icon: const Icon(Icons.cloud_done, color: Colors.amber),
            label: const Text('Saved Decks',
                style: TextStyle(color: Colors.amber)),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _startNewDeck,
        backgroundColor: Colors.purple,
        icon: const Icon(Icons.add),
        label: const Text('New Deck'),
      ),
      body: Consumer<DeckProvider>(
        builder: (context, deckProvider, _) {
          if (deckProvider.decks.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.dashboard_customize,
                      color: Colors.grey[600], size: 64),
                  const SizedBox(height: 16),
                  Text('No decks yet',
                      style: TextStyle(
                          color: Colors.grey[400],
                          fontSize: 18,
                          fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text('Create a deck to use in battles!',
                      style:
                          TextStyle(color: Colors.grey[600], fontSize: 14)),
                ],
              ),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: deckProvider.decks.length,
            separatorBuilder: (_, _) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final deck = deckProvider.decks[index];
              final isActive = deckProvider.activeDeck?.id == deck.id;
              return _buildDeckCard(deck, isActive, deckProvider);
            },
          );
        },
      ),
    );
  }

  Widget _buildDeckCard(Deck deck, bool isActive, DeckProvider deckProvider) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isActive
              ? Colors.purple
              : Colors.grey.withValues(alpha: 0.3),
          width: isActive ? 2 : 1,
        ),
        color: Theme.of(context).cardTheme.color,
      ),
      child: Column(
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 8, 0),
            child: Row(
              children: [
                if (isActive)
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    margin: const EdgeInsets.only(right: 8),
                    decoration: BoxDecoration(
                      color: Colors.purple.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                          color: Colors.purple.withValues(alpha: 0.5)),
                    ),
                    child: const Text('ACTIVE',
                        style: TextStyle(
                            color: Colors.purple,
                            fontSize: 10,
                            fontWeight: FontWeight.bold)),
                  ),
                Expanded(
                  child: Text(
                    deck.name,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Text('${deck.heroes.length} heroes',
                    style:
                        TextStyle(color: Colors.grey[500], fontSize: 12)),
                PopupMenuButton<String>(
                  icon: Icon(Icons.more_vert, color: Colors.grey[400]),
                  color: Theme.of(context).cardTheme.color,
                  onSelected: (value) {
                    switch (value) {
                      case 'edit':
                        _startEditDeck(deck);
                        break;
                      case 'active':
                        deckProvider.setActiveDeck(deck.id);
                        break;
                      case 'delete':
                        deckProvider.deleteDeck(deck.id);
                        break;
                    }
                  },
                  itemBuilder: (_) => [
                    const PopupMenuItem(
                        value: 'edit',
                        child: Text('Edit')),
                    if (!isActive)
                      const PopupMenuItem(
                          value: 'active',
                          child: Text('Set Active',
                              style: TextStyle(color: Colors.purple))),
                    PopupMenuItem(
                        value: 'delete',
                        child: Text('Delete',
                            style: TextStyle(color: Colors.red[300]))),
                  ],
                ),
              ],
            ),
          ),

          // Hero thumbnails
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
            child: SizedBox(
              height: 70,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: deck.heroes.length,
                separatorBuilder: (_, _) => const SizedBox(width: 8),
                itemBuilder: (context, i) {
                  final hero = deck.heroes[i];
                  final rarity = hero.getRarity();
                  final rarityColor =
                      Color(int.parse('0xFF${rarity.color}'));
                  return Container(
                    width: 50,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: rarityColor, width: 1.5),
                      color: Theme.of(context).scaffoldBackgroundColor,
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(7),
                      child: HeroImageWidget(
                        hero: hero,
                        width: 50,
                        height: 70,
                        borderRadius: BorderRadius.circular(7),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Editor view (create / edit) ──────────────────────────────────────

  Widget _buildEditorView() {
    final isNew = _editingDeckId == 'new';
    return Scaffold(
      appBar: AppBar(
        title: Text(isNew ? 'New Deck' : 'Edit Deck'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: _backToList,
        ),
        actions: [
          TextButton.icon(
            onPressed: _saveDeckToDb,
            icon: const Icon(Icons.cloud_upload, color: Colors.amber),
            label:
                const Text('Save Deck', style: TextStyle(color: Colors.amber)),
          ),
          TextButton.icon(
            onPressed: _saveDeck,
            icon: const Icon(Icons.save, color: Colors.green),
            label: const Text('Save', style: TextStyle(color: Colors.green)),
          ),
        ],
      ),
      body: Column(
        children: [
          _buildDeckHeader(),
          const Divider(color: Colors.white24, height: 1),
          _buildSearchBar(),
          Expanded(child: _buildHeroGrid()),
        ],
      ),
    );
  }

  Widget _buildDeckHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Theme.of(context).cardTheme.color,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextField(
            controller: _deckNameController,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
            decoration: InputDecoration(
              hintText: 'Deck Name',
              hintStyle: TextStyle(color: Colors.grey[600]),
              border: InputBorder.none,
              prefixIcon:
                  const Icon(Icons.edit, color: Colors.purple, size: 20),
              contentPadding: EdgeInsets.zero,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '${_selectedHeroes.length}/5 heroes selected',
            style: TextStyle(
              color: _selectedHeroes.isEmpty ? Colors.grey[500] : Colors.green,
              fontSize: 13,
            ),
          ),
          if (_selectedHeroes.isNotEmpty) ...[
            const SizedBox(height: 12),
            SizedBox(
              height: 80,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _selectedHeroes.length,
                separatorBuilder: (_, _) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final hero = _selectedHeroes[index];
                  final rarity = hero.getRarity();
                  final rarityColor =
                      Color(int.parse('0xFF${rarity.color}'));
                  return GestureDetector(
                    onTap: () => _toggleHero(hero),
                    child: Container(
                      width: 60,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: rarityColor, width: 2),
                        color: Theme.of(context).scaffoldBackgroundColor,
                      ),
                      child: Stack(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: HeroImageWidget(
                              hero: hero,
                              width: 60,
                              height: 80,
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          Positioned(
                            bottom: 0,
                            left: 0,
                            right: 0,
                            child: Container(
                              padding:
                                  const EdgeInsets.symmetric(vertical: 2),
                              decoration: BoxDecoration(
                                color:
                                    Colors.black.withValues(alpha: 0.7),
                                borderRadius: const BorderRadius.vertical(
                                    bottom: Radius.circular(8)),
                              ),
                              child: Text(
                                hero.name,
                                textAlign: TextAlign.center,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 8,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                          Positioned(
                            top: 2,
                            right: 2,
                            child: Container(
                              padding: const EdgeInsets.all(2),
                              decoration: const BoxDecoration(
                                color: Colors.red,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.close,
                                  color: Colors.white, size: 10),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
              color: Colors.purple.withValues(alpha: 0.3), width: 2),
          color: Theme.of(context).cardTheme.color,
        ),
        child: TextField(
          controller: _searchController,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: 'Search heroes to add...',
            hintStyle: TextStyle(color: Colors.grey[500]),
            border: InputBorder.none,
            prefixIcon: const Icon(Icons.search, color: Colors.purple),
            suffixIcon: _searchController.text.isNotEmpty
                ? GestureDetector(
                    onTap: () {
                      _searchController.clear();
                      context.read<HeroSearchProvider>().clearSearch();
                      context
                          .read<HeroSearchProvider>()
                          .getRandomHeroes(count: 8);
                      setState(() {});
                    },
                    child: const Icon(Icons.clear, color: Colors.purple),
                  )
                : null,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
          ),
          onChanged: (value) {
            setState(() {});
            if (value.length >= 2) {
              context.read<HeroSearchProvider>().searchHeroes(value);
            }
          },
        ),
      ),
    );
  }

  Widget _buildHeroGrid() {
    return Consumer2<HeroSearchProvider, PlayerProvider>(
      builder: (context, heroProvider, playerProvider, _) {
        final allHeroes = heroProvider.hasSearchResults
            ? heroProvider.searchResults
            : heroProvider.allHeroes;

        // Only show unlocked heroes (common/uncommon always available)
        final heroes = allHeroes.where((hero) {
          final rarity = hero.getRarity();
          if (rarity.index < CardRarity.rare.index) return true;
          return playerProvider.isHeroUnlocked(hero.id);
        }).toList();

        if (heroProvider.isLoading) {
          return const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircularProgressIndicator(),
                SizedBox(height: 16),
                Text('Loading heroes...',
                    style: TextStyle(color: Colors.grey, fontSize: 16)),
              ],
            ),
          );
        }

        if (heroProvider.errorMessage != null) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error, color: Colors.red, size: 48),
                const SizedBox(height: 8),
                Text(heroProvider.errorMessage!,
                    style: const TextStyle(color: Colors.red),
                    textAlign: TextAlign.center),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => heroProvider.getRandomHeroes(count: 8),
                  child: const Text('Retry'),
                ),
              ],
            ),
          );
        }

        if (heroes.isEmpty) {
          return Center(
            child: Text('No heroes found',
                style: TextStyle(color: Colors.grey[400], fontSize: 16)),
          );
        }

        return GridView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 0.7,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
          ),
          itemCount: heroes.length,
          itemBuilder: (context, index) {
            final hero = heroes[index];
            final isSelected =
                _selectedHeroes.any((h) => h.id == hero.id);

            return HeroCard(
              hero: hero,
              isSelected: isSelected,
              onTap: () => _toggleHero(hero),
            );
          },
        );
      },
    );
  }
}
