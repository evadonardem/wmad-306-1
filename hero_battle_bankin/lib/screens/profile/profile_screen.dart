import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/player_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  /// Opens a dialog to allow the user to rename their hero
  void _showRenameDialog(BuildContext context, PlayerProvider provider) {
    final controller = TextEditingController(text: provider.playerName);
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Rename Hero'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(hintText: "Enter hero name"),
          maxLength: 15,
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('CANCEL')),
          ElevatedButton(
            onPressed: () {
              provider.updatePlayerName(controller.text);
              Navigator.pop(context);
            },
            child: const Text('SAVE'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final playerProv = context.watch<PlayerProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Player Profile'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          // Header: Avatar with Level Badge
          Center(
            child: Stack(
              children: [
                const CircleAvatar(
                  radius: 60,
                  child: Icon(Icons.person, size: 60),
                ),
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: CircleAvatar(
                    backgroundColor: Colors.amber,
                    radius: 18,
                    child: Text(
                      '${playerProv.level}',
                      style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.black),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          
          // Name with Rename Action
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                playerProv.playerName,
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              IconButton(
                icon: const Icon(Icons.edit, size: 20, color: Colors.blue),
                onPressed: () => _showRenameDialog(context, playerProv),
              ),
            ],
          ),
          
          const SizedBox(height: 12),
          
          // XP Progress Bar
          Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Level Progress', style: TextStyle(fontSize: 12, color: Colors.grey)),
                  Text('${playerProv.exp} / ${playerProv.expToNextLevel} XP', style: const TextStyle(fontSize: 12)),
                ],
              ),
              const SizedBox(height: 8),
              LinearProgressIndicator(
                value: playerProv.exp / playerProv.expToNextLevel,
                minHeight: 10,
                borderRadius: BorderRadius.circular(10),
                backgroundColor: Colors.grey.withOpacity(0.2),
                color: Colors.blueAccent,
              ),
            ],
          ),

          const SizedBox(height: 32),
          
          // Stats & Settings Cards
          Card(
            child: ListTile(
              leading: const Icon(Icons.emoji_events, color: Colors.amber),
              title: const Text('Total Victories'),
              trailing: Text(
                '${playerProv.totalWins}', 
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)
              ),
            ),
          ),

          const SizedBox(height: 8),

          Card(
            child: SwitchListTile(
              title: const Text('Dark Theme'),
              subtitle: const Text('Toggle app-wide dark mode'),
              secondary: Icon(playerProv.isDarkTheme ? Icons.dark_mode : Icons.light_mode),
              value: playerProv.isDarkTheme,
              onChanged: (bool value) => playerProv.toggleTheme(),
            ),
          ),
        ],
      ),
    );
  }
}