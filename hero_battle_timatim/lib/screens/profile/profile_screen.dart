// Profile screen with a clean user card, theme toggle, and quick navigation.

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/player_provider.dart';
import '../../router/app_router.dart';
import '../../theme/app_theme.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});
  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late final TextEditingController _nameCtrl;

  @override
  void initState() {
    super.initState();
    _nameCtrl = TextEditingController(
      text: context.read<PlayerProvider>().playerName,
    );
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.medium),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.medium),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Player Name', style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: AppSpacing.small),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _nameCtrl,
                          decoration: const InputDecoration(
                            hintText: 'Hero',
                          ),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.small),
                      ElevatedButton(
                        onPressed: () async {
                          final name = _nameCtrl.text.trim();
                          if (name.isEmpty) return;
                          await context.read<PlayerProvider>().updatePlayerName(name);
                          if (!context.mounted) return;
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Name saved')),
                          );
                        },
                        child: const Text('Save'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.medium),
          Consumer<PlayerProvider>(
            builder: (context, player, _) => Card(
              child: SwitchListTile(
                title: const Text('Dark Theme'),
                subtitle: const Text('Persisted across restarts'),
                value: player.isDarkTheme,
                activeColor: AppColors.primary,
                onChanged: (_) => player.toggleTheme(),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.medium),
          Consumer<PlayerProvider>(
            builder: (context, player, _) => Card(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.medium),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Total Wins', style: Theme.of(context).textTheme.titleLarge),
                    Text(
                      '${player.totalWins}',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        color: AppColors.primary,
                        fontSize: 24,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.large),
          OutlinedButton.icon(
            icon: const Icon(Icons.history),
            label: const Text('Battle History'),
            onPressed: () => Navigator.pushNamed(context, RouteNames.history),
            style: OutlinedButton.styleFrom(
              minimumSize: const Size.fromHeight(52),
              side: BorderSide(color: AppColors.border),
            ),
          ),
          const SizedBox(height: AppSpacing.small),
          OutlinedButton.icon(
            icon: const Icon(Icons.bookmark),
            label: const Text('Saved Decks'),
            onPressed: () => Navigator.pushNamed(context, RouteNames.savedDecks),
            style: OutlinedButton.styleFrom(
              minimumSize: const Size.fromHeight(52),
              side: BorderSide(color: AppColors.border),
            ),
          ),
        ],
      ),
    );
  }
}
