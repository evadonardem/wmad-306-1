// Exercise 1 — list & delete saved decks from SQLite.

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/deck_provider.dart';
import '../../services/database_service.dart';
import '../../theme/app_theme.dart';

class SavedDecksScreen extends StatefulWidget {
  const SavedDecksScreen({super.key});
  @override
  State<SavedDecksScreen> createState() => _SavedDecksScreenState();
}

class _SavedDecksScreenState extends State<SavedDecksScreen> {
  // Stored in field per the rubric — never created in build().
  late Future<List<Map<String, dynamic>>> _future;

  @override
  void initState() {
    super.initState();
    _future = DatabaseService().loadDecks();
  }

  void _refresh() {
    setState(() {
      _future = DatabaseService().loadDecks();
    });
  }

  Future<void> _delete(int id) async {
    await DatabaseService().deleteDeck(id);
    if (!mounted) return;
    _refresh();
  }

  Future<void> _load(Map<String, dynamic> row) async {
    final db = DatabaseService();
    final heroes = db.decodeDeckHeroes(row['heroes'] as String);
    if (!mounted) return;
    context.read<DeckProvider>().loadDeck(heroes);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('"${row['name']}" loaded into deck'),
      ),
    );
    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Saved Decks')),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _future,
        builder: (context, snap) {
          if (snap.connectionState != ConnectionState.done) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }
          if (snap.hasError) {
            return Center(
              child: Text(
                'Error: ${snap.error}',
                style: TextStyle(color: AppColors.danger),
              ),
            );
          }
          final rows = snap.data ?? const [];
          if (rows.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.large),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.bookmark_border,
                      color: AppColors.primary,
                      size: 64,
                    ),
                    const SizedBox(height: AppSpacing.medium),
                    Text(
                      'No saved decks yet',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                  ],
                ),
              ),
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.all(AppSpacing.medium),
            itemCount: rows.length,
            itemBuilder: (_, i) {
              final r = rows[i];
              return Card(
                margin: const EdgeInsets.only(bottom: AppSpacing.small),
                child: ListTile(
                  leading: Icon(
                    Icons.style,
                    color: AppColors.primary,
                  ),
                  title: Text(
                    r['name'] as String,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  subtitle: Text(
                    'Created ${(r['created'] as String).substring(0, 10)}',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  onTap: () => _load(r),
                  trailing: IconButton(
                    icon: Icon(
                      Icons.delete,
                      color: AppColors.danger,
                    ),
                    onPressed: () => _delete(r['id'] as int),
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
