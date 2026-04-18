import 'package:flutter/material.dart';

import 'package:hero_battle/services/database_service.dart';

class SavedDecksScreen extends StatefulWidget {
  const SavedDecksScreen({super.key});

  @override
  State<SavedDecksScreen> createState() => _SavedDecksScreenState();
}

class _SavedDecksScreenState extends State<SavedDecksScreen> {
  final DatabaseService _databaseService = DatabaseService();
  late Future<List<Map<String, dynamic>>> _futureDecks;

  @override
  void initState() {
    super.initState();
    _futureDecks = _databaseService.loadDecks();
  }

  Future<void> _refresh() async {
    setState(() {
      _futureDecks = _databaseService.loadDecks();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Saved Decks')),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _futureDecks,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          final decks = snapshot.data ?? <Map<String, dynamic>>[];
          if (decks.isEmpty) {
            return const Center(child: Text('No saved decks yet.'));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: decks.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final deck = decks[index];
              final heroes = (deck['heroes'] as List<dynamic>).cast<Map<String, dynamic>>();
              return Card(
                child: ListTile(
                  title: Text(deck['name'] as String),
                  subtitle: Text(
                    '${heroes.length} hero(s)\n${heroes.map((hero) => hero['name'] as String).join(', ')}',
                  ),
                  isThreeLine: true,
                  trailing: IconButton(
                    icon: const Icon(Icons.delete_outline),
                    onPressed: () async {
                      await _databaseService.deleteDeck(deck['id'] as int);
                      await _refresh();
                    },
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}