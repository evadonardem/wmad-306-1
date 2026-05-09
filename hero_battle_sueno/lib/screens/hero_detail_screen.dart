import 'package:flutter/material.dart';
import '../models/hero_model.dart';
import '../widgets/hero_image.dart';

class HeroDetailScreen extends StatelessWidget {
  final HeroModel hero;

  const HeroDetailScreen({super.key, required this.hero});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(hero.name)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            buildHeroImage(hero.imageUrl, hero.name, height: 250),

            const SizedBox(height: 16),

            /// ✅ FIX: removed fullName
            Text(hero.name, style: const TextStyle(fontSize: 20)),

            const SizedBox(height: 16),

            /// 📊 STATS (FIXED)
            _stat("Intelligence", hero.powerStats.intelligence),
            _stat("Strength", hero.powerStats.strength),
            _stat("Speed", hero.powerStats.speed),
            _stat("Durability", hero.powerStats.durability),
            _stat("Power", hero.powerStats.power),
            _stat("Combat", hero.powerStats.combat),

            const SizedBox(height: 20),

            /// ➕ ADD TO DECK BUTTON
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context, hero);
              },
              child: const Text("Add to Deck"),
            ),
          ],
        ),
      ),
    );
  }

  Widget _stat(String label, int value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("$label: $value"),
        LinearProgressIndicator(value: value / 100),
        const SizedBox(height: 8),
      ],
    );
  }
}
