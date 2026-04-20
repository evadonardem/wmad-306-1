import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/player_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final playerProvider = Provider.of<PlayerProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            TextFormField(
              initialValue: playerProvider.name,
              decoration: const InputDecoration(labelText: 'Player Name'),
              onChanged: playerProvider.setName,
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Dark Theme'),
                Switch(
                  value: playerProvider.isDarkTheme,
                  onChanged: playerProvider.toggleTheme,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
