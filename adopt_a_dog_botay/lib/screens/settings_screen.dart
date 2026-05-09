import 'package:adopt_a_dog/services/theme_service.dart';
import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  final ThemeModel themeModel;

  const SettingsScreen({super.key, required this.themeModel});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Theme Mode', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            AnimatedBuilder(
              animation: themeModel,
              builder: (_, __) {
                final mode = themeModel.mode;
                return Column(
                  children: [
                    RadioListTile<ThemeMode>(
                      value: ThemeMode.system,
                      groupValue: mode,
                      title: const Text('System'),
                      onChanged: (v) async {
                        if (v != null) await themeModel.setMode(v);
                      },
                    ),
                    RadioListTile<ThemeMode>(
                      value: ThemeMode.light,
                      groupValue: mode,
                      title: const Text('Light'),
                      onChanged: (v) async {
                        if (v != null) await themeModel.setMode(v);
                      },
                    ),
                    RadioListTile<ThemeMode>(
                      value: ThemeMode.dark,
                      groupValue: mode,
                      title: const Text('Dark'),
                      onChanged: (v) async {
                        if (v != null) await themeModel.setMode(v);
                      },
                    ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
