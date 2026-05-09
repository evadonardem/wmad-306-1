import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/warrior_model.dart';
import '../../providers/squad_provider.dart';
import '../../services/storage_service.dart';
import '../../widgets/warrior_image.dart';

class SavedSquadsScreen extends StatefulWidget {
  const SavedSquadsScreen({super.key});

  @override
  State<SavedSquadsScreen> createState() => _SavedSquadsScreenState();
}

class _SavedSquadsScreenState extends State<SavedSquadsScreen> {
  late Future<List<Map<String, dynamic>>> _future;

  @override
  void initState() {
    super.initState();
    _future = StorageService().loadSquads();
  }

  void _reload() => setState(() {
    _future = StorageService().loadSquads();
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Saved Squads')),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _future,
        builder: (_, snap) {
          if (snap.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          final rows = snap.data ?? [];
          if (rows.isEmpty) {
            return const Center(child: Text('No saved squads yet.'));
          }
          return ListView.builder(
            itemCount: rows.length,
            itemBuilder: (_, i) => _SquadTile(
              row: rows[i],
              onDelete: _reload,
              onLoad: _reload,
            ),
          );
        },
      ),
    );
  }
}

class _SquadTile extends StatelessWidget {
  final Map<String, dynamic> row;
  final VoidCallback onDelete;
  final VoidCallback onLoad;

  const _SquadTile({
    required this.row,
    required this.onDelete,
    required this.onLoad,
  });

  @override
  Widget build(BuildContext context) {
    final db = StorageService();
    final warriors = db.tryDecode(row['warriors'] as String? ?? '[]');

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        title: Text(
          row['label'] as String? ?? 'Unnamed Squad',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 6),
            SizedBox(
              height: 40,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: warriors.length,
                itemBuilder: (_, i) => Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: WarriorImage(url: warriors[i].imageUrl, size: 40),
                ),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              warriors.map((w) => w.name).join(', '),
              style: Theme.of(context).textTheme.bodySmall,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextButton(
              child: const Text('Load'),
              onPressed: () {
                final sp = context.read<SquadProvider>();
                sp.clearRoster();
                for (final w in warriors) {
                  sp.addWarrior(w);
                }
                Navigator.pop(context);
              },
            ),
            IconButton(
              icon: const Icon(Icons.delete_outline_rounded),
              color: Theme.of(context).colorScheme.error,
              onPressed: () async {
                await StorageService().deleteSquad(row['id'] as int);
                onDelete();
              },
            ),
          ],
        ),
      ),
    );
  }
}

// Extend StorageService to expose tryDecode publicly
extension StorageExt on StorageService {
  List<WarriorModel> tryDecode(String json) {
    try {
      return decodeWarriors(json);
    } catch (_) {
      return [];
    }
  }
}
