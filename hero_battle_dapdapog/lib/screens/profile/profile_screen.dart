import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:hero_battle/providers/player_provider.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late final TextEditingController _nameController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _nameController.text = context.read<PlayerProvider>().playerName;
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: Consumer<PlayerProvider>(
        builder: (context, player, _) {
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      TextField(
                        controller: _nameController,
                        decoration: const InputDecoration(labelText: 'Player name'),
                        textInputAction: TextInputAction.done,
                        onSubmitted: (value) {
                          player.setPlayerName(value);
                        },
                      ),
                      const SizedBox(height: 12),
                      FilledButton(
                        onPressed: () {
                          player.setPlayerName(_nameController.text);
                        },
                        child: const Text('Save Name'),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Card(
                child: SwitchListTile.adaptive(
                  title: const Text('Dark Theme'),
                  value: player.isDarkTheme,
                  onChanged: (value) {
                    player.toggleTheme(value);
                  },
                ),
              ),
              const SizedBox(height: 12),
              Card(
                child: ListTile(
                  title: const Text('Wins'),
                  trailing: Text(
                    '${player.totalWins}',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}