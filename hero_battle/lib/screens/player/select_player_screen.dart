import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/player.dart';
import '../../providers/player_provider.dart';

class SelectPlayerScreen extends StatelessWidget {
  const SelectPlayerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final playerProvider = context.watch<PlayerProvider>();
    final players = playerProvider.players;

    return Scaffold(
      appBar: AppBar(title: const Text('Select Player')),
      body: ListView.builder(
        itemCount: players.length,
        itemBuilder: (context, index) {
          final player = players[index];
          return ListTile(
            title: Text(player.name),
            subtitle: Text('Wins: ${player.wins}  Losses: ${player.losses}'),
            onTap: () {
              playerProvider.switchPlayer(player);
              Navigator.pop(context); // Or navigate to home
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: () async {
          final name = await showDialog<String>(
            context: context,
            builder: (context) => _AddPlayerDialog(),
          );
          if (name != null && name.trim().isNotEmpty) {
            playerProvider.addPlayer(name.trim());
          }
        },
      ),
    );
  }
}

class _AddPlayerDialog extends StatelessWidget {
  final TextEditingController controller = TextEditingController();

  _AddPlayerDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('New Player'),
      content: TextField(
        controller: controller,
        decoration: const InputDecoration(hintText: 'Enter player name'),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () => Navigator.pop(context, controller.text),
          child: const Text('Add'),
        ),
      ],
    );
  }
}
