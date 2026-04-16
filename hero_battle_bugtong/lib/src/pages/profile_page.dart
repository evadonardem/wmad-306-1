import 'package:flutter/material.dart';

import '../app_store.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key, required this.store});

  final AppStore store;

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  late final TextEditingController _nameController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.store.playerName);
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: widget.store,
      builder: (context, _) {
        final history = widget.store.history;
        final wins = history.where((r) => r.playerWon).length;
        final losses = history.length - wins;
        final winRate = history.isEmpty ? 0 : (wins / history.length * 100).round();

        return Scaffold(
          appBar: AppBar(title: const Text('Player Profile')),
          body: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              CircleAvatar(
                radius: 48,
                child: Text(
                  (widget.store.playerName.isEmpty ? 'H' : widget.store.playerName[0]).toUpperCase(),
                  style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w800),
                ),
              ),
              const SizedBox(height: 12),
              Center(
                child: Text(
                  widget.store.playerName,
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
              ),
              const SizedBox(height: 20),
              TextField(
                controller: _nameController,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Player Name',
                ),
                maxLength: 20,
              ),
              FilledButton(
                onPressed: () => widget.store.setPlayerName(_nameController.text),
                child: const Text('Save Name'),
              ),
              const SizedBox(height: 12),
              SwitchListTile(
                title: const Text('Dark Mode'),
                value: widget.store.isDark,
                onChanged: (_) => widget.store.toggleTheme(),
              ),
              const SizedBox(height: 12),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Battle Stats', style: Theme.of(context).textTheme.titleMedium),
                      const SizedBox(height: 8),
                      Text('Total Battles: ${history.length}'),
                      Text('Wins: $wins'),
                      Text('Losses: $losses'),
                      Text('Win Rate: $winRate%'),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
