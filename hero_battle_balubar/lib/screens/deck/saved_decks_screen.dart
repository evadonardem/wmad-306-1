import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:hero_battle/models/hero_model.dart';
import 'package:hero_battle/services/database_service.dart';
import 'package:hero_battle/widgets/hero_image_widget.dart';

class SavedDecksScreen extends StatefulWidget {
  const SavedDecksScreen({super.key});

  @override
  State<SavedDecksScreen> createState() => _SavedDecksScreenState();
}

class _SavedDecksScreenState extends State<SavedDecksScreen> {
  final DatabaseService _dbService = DatabaseService();
  List<Map<String, dynamic>> _savedDecks = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDecks();
  }

  Future<void> _loadDecks() async {
    setState(() => _isLoading = true);
    final decks = await _dbService.getAllDecks();
    setState(() {
      _savedDecks = decks;
      _isLoading = false;
    });
  }

  Future<void> _deleteDeck(int id) async {
    await _dbService.deleteDeckById(id);
    _loadDecks();
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Deck deleted'),
        backgroundColor: Colors.orange,
      ),
    );
  }

  List<HeroModel> _parseHeroes(String heroesJson) {
    final list = jsonDecode(heroesJson) as List;
    return list
        .map((h) => HeroModel.fromJson(h as Map<String, dynamic>))
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Saved Decks'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _savedDecks.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.cloud_off,
                          color: Colors.grey[600], size: 64),
                      const SizedBox(height: 16),
                      Text('No saved decks',
                          style: TextStyle(
                              color: Colors.grey[400],
                              fontSize: 18,
                              fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text(
                          'Use "Save Deck" in the deck editor to save here.',
                          style: TextStyle(
                              color: Colors.grey[600], fontSize: 14)),
                    ],
                  ),
                )
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: _savedDecks.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final row = _savedDecks[index];
                    final heroes = _parseHeroes(row['heroes'] as String);
                    final name = row['name'] as String;
                    final createdAt = row['created_at'] as String;
                    final id = row['id'] as int;

                    return Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                            color: Colors.amber.withValues(alpha: 0.4)),
                        color: Theme.of(context).cardTheme.color,
                      ),
                      child: Column(
                        children: [
                          Padding(
                            padding:
                                const EdgeInsets.fromLTRB(16, 12, 8, 0),
                            child: Row(
                              children: [
                                const Icon(Icons.cloud_done,
                                    color: Colors.amber, size: 18),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    name,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                Text('${heroes.length} heroes',
                                    style: TextStyle(
                                        color: Colors.grey[500],
                                        fontSize: 12)),
                                IconButton(
                                  icon: Icon(Icons.delete_outline,
                                      color: Colors.red[300], size: 20),
                                  onPressed: () => _deleteDeck(id),
                                ),
                              ],
                            ),
                          ),
                          Padding(
                            padding:
                                const EdgeInsets.fromLTRB(16, 0, 16, 4),
                            child: Align(
                              alignment: Alignment.centerLeft,
                              child: Text(
                                createdAt.substring(0, 10),
                                style: TextStyle(
                                    color: Colors.grey[600], fontSize: 11),
                              ),
                            ),
                          ),
                          Padding(
                            padding:
                                const EdgeInsets.fromLTRB(16, 4, 16, 12),
                            child: SizedBox(
                              height: 70,
                              child: ListView.separated(
                                scrollDirection: Axis.horizontal,
                                itemCount: heroes.length,
                                separatorBuilder: (context, i2) =>
                                    const SizedBox(width: 8),
                                itemBuilder: (context, i) {
                                  final hero = heroes[i];
                                  final rarity = hero.getRarity();
                                  final rarityColor = Color(int.parse(
                                      '0xFF${rarity.color}'));
                                  return Container(
                                    width: 50,
                                    decoration: BoxDecoration(
                                      borderRadius:
                                          BorderRadius.circular(8),
                                      border: Border.all(
                                          color: rarityColor, width: 1.5),
                                      color: Theme.of(context).scaffoldBackgroundColor,
                                    ),
                                    child: ClipRRect(
                                      borderRadius:
                                          BorderRadius.circular(7),
                                      child: HeroImageWidget(
                                        hero: hero,
                                        width: 50,
                                        height: 70,
                                        borderRadius:
                                            BorderRadius.circular(7),
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
                  },
                ),
    );
  }
}
